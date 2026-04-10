import { NextResponse } from 'next/server';

export const GET = () => {
  const robotsTxt = `# Robots.txt for ResuSync
User-agent: *
Allow: /

# Disallow admin area
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: https://resume.vtusync.in/sitemap.xml

Crawl-delay: 1
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};