import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

(async () => {
  // List of your site URLs for sitemap
  const links = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/Gallery', changefreq: 'monthly', priority: 0.8 },
    { url: '/courses', changefreq: 'monthly', priority: 0.9 },
    { url: '/enroll-now', changefreq: 'monthly', priority: 0.9 },
  ];

  const sitemapStream = new SitemapStream({ hostname: 'https://www.moderncomputerworldug.com' });
  const writeStream = createWriteStream(resolve('public', 'sitemap.xml'));

  sitemapStream.pipe(writeStream);
  links.forEach(link => sitemapStream.write(link));
  sitemapStream.end();

  await streamToPromise(writeStream);

  console.log('✅ Sitemap generated at public/sitemap.xml');
})();
