'use server';

import { generateObject, LanguageModelV1 } from 'ai';
import { z } from 'zod';
import { initializeAIClient } from '@/utils/ai-tools';
import { getSubscriptionPlan } from '../stripe/actions';

export interface CrawledJobResult {
  success: boolean;
  position_title: string;
  company_name: string;
  location: string;
  employment_type: string;
  description: string;
  job_url: string;
  error?: string;
}

/**
 * Strips HTML tags, converts structural tags to whitespace/newlines,
 * and decodes basic entities.
 */
function htmlToCleanText(html: string): string {
  if (!html) return '';

  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Convert common block elements to newlines
  cleaned = cleaned
    .replace(/<\/(p|div|h[1-6]|tr)>/gi, '\n\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '');

  // Strip all remaining tags
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, '·');

  // Normalize excessive blank lines and whitespace
  return cleaned
    .split('\n')
    .map(line => line.trim())
    .filter((line, i, arr) => line.length > 0 || (i > 0 && arr[i - 1].length > 0))
    .join('\n')
    .trim();
}

/**
 * Extracts metadata and main text from arbitrary HTML.
 */
function cleanHtmlContent(html: string): { text: string; metaTitle: string; metaDescription: string } {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*name=["']title["'][^>]*content=["']([^"']+)["']/i);
  
  const metaDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

  const metaTitle = (metaTitleMatch?.[1] || titleMatch?.[1] || '').trim();
  const metaDescription = (metaDescMatch?.[1] || '').trim();

  const cleaned = htmlToCleanText(html);

  return {
    text: cleaned.slice(0, 15000),
    metaTitle,
    metaDescription
  };
}

/**
 * Specialized extractor for VTU / Internyet job postings.
 * Internyet is an SPA; its backend REST API holds all structured data.
 */
async function extractVtuInternyet(url: string): Promise<CrawledJobResult | null> {
  const slugMatch = url.match(/\/internships?\/([^\/\?#]+)/i);
  if (!slugMatch || !slugMatch[1]) return null;

  const slug = slugMatch[1];
  try {
    const apiUrl = `https://vtuapi.internyet.in/api/v1/internships/${slug}`;
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;

    const data = json.data;
    const positionTitle = data.title || '';
    const companyName = data.company?.name || '';
    
    const locationParts = [data.city, data.state, data.country].filter(Boolean);
    const location = locationParts.join(', ') || (data.workMode ? `Work Mode: ${data.workMode}` : 'India');
    const employmentType = data.type || (data.workMode ? `Internship (${data.workMode})` : 'Internship');

    const skills = Array.isArray(data.skills)
      ? data.skills.map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean).join(', ')
      : '';

    // Convert HTML content into readable text
    const contentText = htmlToCleanText(data.content || data.description || '');

    // Build comprehensive description
    const descSections: string[] = [];
    if (data.stipend) descSections.push(`Stipend: ${data.stipend}`);
    if (data.duration) descSections.push(`Duration: ${data.duration}`);
    if (data.workMode) descSections.push(`Work Mode: ${data.workMode}`);
    if (skills) descSections.push(`Key Skills: ${skills}`);
    if (data.number_of_positions) descSections.push(`Openings: ${data.number_of_positions}`);
    if (contentText) descSections.push(`\nJob Description:\n${contentText}`);

    return {
      success: true,
      position_title: positionTitle,
      company_name: companyName,
      location,
      employment_type: employmentType,
      description: descSections.join('\n'),
      job_url: url,
    };
  } catch (err) {
    console.warn('[extractVtuInternyet] Error fetching API:', err);
    return null;
  }
}

/**
 * Specialized extractor for LinkedIn Job Postings using public guest job endpoint.
 * Bypasses LinkedIn login wall to fetch full SSR HTML.
 */
async function extractLinkedIn(url: string): Promise<CrawledJobResult | null> {
  const match = url.match(/\/jobs\/view\/(?:[^\/]+-)?(\d+)/i) || 
                url.match(/currentJobId=(\d+)/i) ||
                url.match(/\/jobs\/view\/(\d+)/i);
  if (!match || !match[1]) return null;

  const jobId = match[1];
  try {
    const guestUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
    const res = await fetch(guestUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const html = await res.text();

    const title = (
      html.match(/<h2[^>]*class=["'][^"']*top-card-layout__title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i)?.[1] ||
      html.match(/<h1[^>]*class=["'][^"']*topcard__title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)?.[1] ||
      ''
    ).trim();

    const company = (
      html.match(/<a[^>]*class=["'][^"']*topcard__org-name-link[^"']*["'][^>]*>([\s\S]*?)<\/a>/i)?.[1] ||
      html.match(/<span[^>]*class=["'][^"']*topcard__flavor[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] ||
      ''
    ).trim();

    const location = (
      html.match(/<span[^>]*class=["'][^"']*topcard__flavor--bullet[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] ||
      ''
    ).trim();

    const descHtmlMatch = html.match(/<div[^>]*class=["'][^"']*show-more-less-html__markup[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    const description = descHtmlMatch?.[1] ? htmlToCleanText(descHtmlMatch[1]) : '';

    if (!title && !description) return null;

    return {
      success: true,
      position_title: title,
      company_name: company,
      location,
      employment_type: 'Full-time',
      description,
      job_url: url,
    };
  } catch (err) {
    console.warn('[extractLinkedIn] Error fetching guest API:', err);
    return null;
  }
}

/**
 * Attempts to extract JSON-LD JobPosting schema from HTML.
 */
function extractJsonLdJobPosting(html: string): Partial<CrawledJobResult> | null {
  try {
    const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const jsonText = match[1].trim();
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];

      for (const item of items) {
        if (item && (item['@type'] === 'JobPosting' || item['@type']?.includes?.('JobPosting'))) {
          const position_title = item.title || item.name || '';
          const company_name = typeof item.hiringOrganization === 'object' ? item.hiringOrganization?.name : '';
          const location = typeof item.jobLocation === 'object' 
            ? (item.jobLocation?.address?.addressLocality || item.jobLocation?.address?.name || '')
            : '';
          const employment_type = item.employmentType || 'Full-time';
          const description = htmlToCleanText(item.description || '');

          if (position_title || description) {
            return {
              position_title,
              company_name,
              location,
              employment_type,
              description
            };
          }
        }
      }
    }
  } catch {
    // Non-fatal if JSON-LD parse fails
  }
  return null;
}

/**
 * Crawls a job link and extracts job information using specialized extractors,
 * JSON-LD schema, or the AI model fallback.
 */
export async function crawlJobUrl(targetUrl: string): Promise<CrawledJobResult> {
  const trimmed = targetUrl.trim();
  if (!trimmed) {
    return {
      success: false,
      position_title: '',
      company_name: '',
      location: '',
      employment_type: '',
      description: '',
      job_url: targetUrl,
      error: 'Please provide a valid URL'
    };
  }

  // Ensure URL scheme
  let url = trimmed;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    new URL(url);
  } catch {
    return {
      success: false,
      position_title: '',
      company_name: '',
      location: '',
      employment_type: '',
      description: '',
      job_url: url,
      error: 'Invalid URL format'
    };
  }

  // 1. Check specialized extractors first
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.toLowerCase();

  // VTU / Internyet specialized handler
  if (hostname.includes('internyet.in')) {
    const vtuResult = await extractVtuInternyet(url);
    if (vtuResult && vtuResult.description) {
      return vtuResult;
    }
  }

  // LinkedIn specialized handler
  if (hostname.includes('linkedin.com')) {
    const linkedInResult = await extractLinkedIn(url);
    if (linkedInResult && linkedInResult.description) {
      return linkedInResult;
    }
  }

  // 2. Fetch raw HTML for standard pages
  let html = '';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch page (${res.status} ${res.statusText})`);
    }

    html = await res.text();
  } catch (fetchError) {
    console.error('[crawlJobUrl] Fetch failed:', fetchError);
    return {
      success: false,
      position_title: '',
      company_name: '',
      location: '',
      employment_type: '',
      description: '',
      job_url: url,
      error: `Could not reach ${url}: ${(fetchError as Error)?.message || 'Network error'}`
    };
  }

  // 3. Try JSON-LD JobPosting schema extraction
  const jsonLdResult = extractJsonLdJobPosting(html);
  if (jsonLdResult && jsonLdResult.description && jsonLdResult.description.length > 100) {
    return {
      success: true,
      position_title: jsonLdResult.position_title || '',
      company_name: jsonLdResult.company_name || '',
      location: jsonLdResult.location || '',
      employment_type: jsonLdResult.employment_type || 'Full-time',
      description: jsonLdResult.description,
      job_url: url,
    };
  }

  // 4. Clean HTML content
  const { text, metaTitle, metaDescription } = cleanHtmlContent(html);

  if (!text || text.length < 50) {
    return {
      success: false,
      position_title: metaTitle,
      company_name: '',
      location: '',
      employment_type: '',
      description: metaDescription || '',
      job_url: url,
      error: 'Page returned very little readable content. You may paste the job description directly.'
    };
  }

  // 5. Extract structured details using AI model
  try {
    const { plan } = await getSubscriptionPlan(true);
    const isPro = plan === 'pro';

    const aiClient = initializeAIClient(
      { model: 'openrouter/free', apiKeys: [] },
      isPro
    );

    const { object } = await generateObject({
      model: aiClient as LanguageModelV1,
      schema: z.object({
        position_title: z.string().describe("The job title or role (e.g. 'Senior Frontend Engineer')"),
        company_name: z.string().describe("The hiring company name"),
        location: z.string().describe("Job location (e.g. 'Remote', 'San Francisco, CA')"),
        employment_type: z.string().describe("Employment type e.g. 'Full-time', 'Contract', etc."),
        description: z.string().describe("Clean markdown of job overview, responsibilities, requirements, and qualifications"),
      }),
      system: `You are an expert AI assistant that extracts structured job postings from raw web page text.
Analyze the provided web page text and extract the job details faithfully. Do not invent details.
Ensure the description captures all key duties, required skills, and qualifications.`,
      prompt: `Webpage Title: ${metaTitle}
Meta Description: ${metaDescription}
Page URL: ${url}

Content:
${text.slice(0, 8000)}`,
    });

    return {
      success: true,
      position_title: object.position_title || metaTitle,
      company_name: object.company_name || '',
      location: object.location || '',
      employment_type: object.employment_type || 'Full-time',
      description: object.description || text.slice(0, 3000),
      job_url: url,
    };
  } catch (aiError) {
    console.warn('[crawlJobUrl] AI parsing error, falling back to raw extracted text:', aiError);
    return {
      success: true,
      position_title: metaTitle || 'Job Opportunity',
      company_name: '',
      location: '',
      employment_type: 'Full-time',
      description: text.slice(0, 4000),
      job_url: url,
    };
  }
}
