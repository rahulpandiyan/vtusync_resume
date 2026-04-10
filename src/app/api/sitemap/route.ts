import { NextResponse } from 'next/server';

const staticUrls = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/home', changefreq: 'daily', priority: 0.9 },
  { loc: '/auth/login', changefreq: 'monthly', priority: 0.5 },
  { loc: '/auth/signup', changefreq: 'monthly', priority: 0.5 },
  { loc: '/blog', changefreq: 'weekly', priority: 0.7 },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map(
    (url) => `  <url>
    <loc>https://resume.vtusync.in${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

export const GET = () => {
  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};