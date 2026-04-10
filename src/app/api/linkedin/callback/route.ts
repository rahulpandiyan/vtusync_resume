import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, fetchLinkedInProfile } from '@/utils/actions/linkedin/actions';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('LinkedIn OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/profile?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/profile?error=linkedin_no_code`, requestUrl.origin)
    );
  }

  try {
    console.log('1. Exchanging code for token...');
    const tokenResult = await exchangeCodeForToken(code);

    if (!tokenResult.success || !tokenResult.accessToken) {
      console.error('LinkedIn token error:', tokenResult.error);
      return NextResponse.redirect(
        new URL(`/profile?error=linkedin_token_failed`, requestUrl.origin)
      );
    }

    console.log('2. Token received, fetching profile...');
    const profileResult = await fetchLinkedInProfile(tokenResult.accessToken);

    console.log('Profile result:', JSON.stringify(profileResult, null, 2));

    if (!profileResult.success || !profileResult.profile) {
      console.error('Profile fetch error:', profileResult.error);
      return NextResponse.redirect(
        new URL(`/profile?error=linkedin_profile_failed&detail=${encodeURIComponent(profileResult.error || '')}`, requestUrl.origin)
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=not_authenticated`, requestUrl.origin)
      );
    }

    console.log('3. Updating profile in database...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: profileResult.profile.first_name || null,
        last_name: profileResult.profile.last_name || null,
        email: profileResult.profile.email || null,
        linkedin_url: profileResult.profile.linkedin_url || null,
        work_experience: profileResult.profile.work_experience || [],
        education: profileResult.profile.education || [],
        skills: profileResult.profile.skills || [],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.redirect(
        new URL(`/profile?error=linkedin_update_failed`, requestUrl.origin)
      );
    }

    return NextResponse.redirect(
      new URL(`/profile?success=linkedin_imported&info=manual`, requestUrl.origin)
    );
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect(
      new URL(`/profile?error=linkedin_unknown`, requestUrl.origin)
    );
  }
}
