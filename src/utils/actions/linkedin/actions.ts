'use server';

import { Profile, WorkExperience, Education } from '@/lib/types';

const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
}

interface LinkedInUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
}

interface LinkedInProfile {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  vanityName?: string;
}



function extractLocalizedValue(value: string | { localized: Record<string, string> } | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const locale = Object.values(value.localized)[0];
  return locale || '';
}

export async function exchangeCodeForToken(code: string): Promise<{
  success: boolean;
  accessToken?: string;
  error?: string;
}> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return {
      success: false,
      error: 'LinkedIn OAuth is not configured. Please contact support.'
    };
  }

  try {
    const response = await fetch(`${LINKEDIN_AUTH_BASE}/accessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);
      return {
        success: false,
        error: `Failed to exchange code for token: ${errorText}`
      };
    }

    const data: LinkedInTokenResponse = await response.json();
    return {
      success: true,
      accessToken: data.access_token
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to exchange code for token'
    };
  }
}

export async function getLinkedInAuthUrl(): Promise<string> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('LinkedIn OAuth is not configured');
  }

  // OIDC scopes - basic profile, email
  const scopes = ['openid', 'profile', 'email'].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: Math.random().toString(36).substring(7),
  });

  return `${LINKEDIN_AUTH_BASE}/authorization?${params.toString()}`;
}

export async function fetchLinkedInProfile(accessToken: string): Promise<{
  success: boolean;
  profile?: Partial<Profile>;
  error?: string;
}> {
  try {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    };

    // Get basic profile first (works with OIDC)
    let userInfo: LinkedInUserInfo;
    
    const userinfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', { headers });
    if (userinfoResponse.ok) {
      userInfo = await userinfoResponse.json();
    } else {
      // Fallback to /me
      const profileResponse = await fetch(`${LINKEDIN_API_BASE}/me`, { headers });
      if (!profileResponse.ok) {
        return { success: false, error: 'Failed to fetch basic profile' };
      }
      const profile: LinkedInProfile = await profileResponse.json();
      userInfo = {
        sub: profile.id,
        given_name: extractLocalizedValue(profile.localizedFirstName),
        family_name: extractLocalizedValue(profile.localizedLastName),
      };
    }

    let workExperience: WorkExperience[] = [];
    let educationList: Education[] = [];

    // Try to get work experience using different API endpoints
    try {
      const positionsResponse = await fetch(
        'https://api.linkedin.com/v2/positions?projection=(elements*(id,companyName,title,locationName,startDate,endDate,description))',
        { headers }
      );
      if (positionsResponse.ok) {
        const data = await positionsResponse.json();
        workExperience = data.elements?.map((pos: Record<string, unknown>) => ({
          company: (pos.companyName as string) || '',
          position: (pos.title as string) || '',
          location: (pos.locationName as string) || '',
          date: '',
          description: (pos.description as string) ? [(pos.description as string)] : [],
          technologies: [],
        })) || [];
      } else {
        console.log('Positions API failed:', positionsResponse.status, await positionsResponse.text());
      }
    } catch (e) {
      console.log('Positions error:', e);
    }

    // Try education
    try {
      const educationResponse = await fetch(
        'https://api.linkedin.com/v2/educations?projection=(elements*(id,schoolName,degreeName,fieldOfStudyName,startDate,endDate))',
        { headers }
      );
      if (educationResponse.ok) {
        const data = await educationResponse.json();
        educationList = data.elements?.map((edu: Record<string, unknown>) => ({
          school: (edu.schoolName as string) || '',
          degree: (edu.degreeName as string) || '',
          field: (edu.fieldOfStudyName as string) || '',
          date: '',
          location: '',
          gpa: undefined,
          achievements: [],
        })) || [];
      } else {
        console.log('Education API failed:', educationResponse.status, await educationResponse.text());
      }
    } catch (e) {
      console.log('Education error:', e);
    }

    const linkedinUrl = userInfo.sub 
      ? `https://linkedin.com/in/${userInfo.sub}` 
      : '';

    return {
      success: true,
      profile: {
        first_name: userInfo.given_name || null,
        last_name: userInfo.family_name || null,
        email: userInfo.email || null,
        linkedin_url: linkedinUrl,
        work_experience: workExperience,
        education: educationList,
        skills: [],
        projects: [],
      },
    };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch LinkedIn profile'
    };
  }
}

export async function isLinkedInConfigured(): Promise<boolean> {
  return !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
}