/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://asksaul.ai',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
  },
  exclude: ['/api/*', '/opengraph-image', '/twitter-image', '/icon', '/apple-icon'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Higher priority for key pages
    const highPriority = ['/', '/services', '/ai-automation', '/voice-agents', '/voice-agents/waste', '/web-development', '/marketing-engine', '/build-your-proposal'];
    return {
      loc: path,
      changefreq: highPriority.includes(path) ? 'daily' : config.changefreq,
      priority: highPriority.includes(path) ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
