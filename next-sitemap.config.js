/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://asksaul.ai',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
  },
  exclude: ['/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Higher priority for key pages
    const highPriority = ['/', '/services', '/ai-automation', '/web-development', '/marketing-engine', '/build-your-proposal'];
    return {
      loc: path,
      changefreq: highPriority.includes(path) ? 'daily' : config.changefreq,
      priority: highPriority.includes(path) ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
