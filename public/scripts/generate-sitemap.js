const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

(async () => {
  // List all your site URLs here
  const links = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/Gallery', changefreq: 'monthly', priority: 0.8 },
    { url: '/courses', changefreq: 'monthly', priority: 0.9 },
    { url: '/enroll-now', changefreq: 'monthly', priority: 0.9 },
  ];

  const sitemapStream = new SitemapStream({ hostname: 'https://www.moderncomputerworldug.com' });

  const writeStream = createWriteStream(path.resolve(__dirname, '../public/sitemap.xml'));

  sitemapStream.pipe(writeStream);

  links.forEach(link => sitemapStream.write(link));

  sitemapStream.end();

  await streamToPromise(writeStream);

  console.log('Sitemap generated at public/sitemap.xml');
})();
