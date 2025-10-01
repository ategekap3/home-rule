import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

(async () => {
  const links = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/Gallery', changefreq: 'monthly', priority: 0.8 },
    { url: '/courses', changefreq: 'monthly', priority: 0.9 },
    { url: '/enroll-now', changefreq: 'monthly', priority: 0.9 },
  ];

  const outputPath = resolve('public', 'sitemap.xml');

  // Ensure the output directory exists
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const sitemapStream = new SitemapStream({ hostname: 'https://www.moderncomputerworldug.com' });
  const writeStream = createWriteStream(outputPath);

  // Pipe sitemap stream to write stream
  sitemapStream.pipe(writeStream);

  // Write links into sitemap
  links.forEach(link => sitemapStream.write(link));
  sitemapStream.end();

  // ✅ Fix: Wait for the sitemap stream to complete
  await streamToPromise(sitemapStream);

  console.log('✅ Sitemap generated at public/sitemap.xml');
})();
