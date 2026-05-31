export const AI_PLATFORMS = [
  { id: 'twitter-thread', label: 'Twitter Thread', format: 'Thread', group: 'social' },
  { id: 'linkedin-post', label: 'LinkedIn Post', format: 'Professional post', group: 'social' },
  { id: 'newsletter', label: 'Newsletter', format: 'Email section', group: 'email' },
  { id: 'medium-article', label: 'Medium Article', format: 'Long-form article', group: 'long-form' },
  { id: 'reddit-post', label: 'Reddit Post', format: 'Community post', group: 'community' },
  { id: 'instagram-post', label: 'Instagram Post', format: 'Caption', group: 'social' },
  { id: 'youtube-script', label: 'YouTube Script', format: 'Video script', group: 'video' },
  { id: 'facebook-post', label: 'Facebook Post', format: 'Social post', group: 'social' },
  { id: 'hacker-news-post', label: 'Hacker News Post', format: 'Launch note', group: 'community' },
  { id: 'indie-hackers-post', label: 'Indie Hackers Post', format: 'Founder update', group: 'community' },
  { id: 'wechat-article', label: 'WeChat Article', format: 'Article', group: 'long-form' },
  { id: 'xiaohongshu-post', label: 'Xiaohongshu Post', format: 'Lifestyle post', group: 'social' },
  { id: 'jike-post', label: 'Jike Post', format: 'Short update', group: 'community' },
  { id: 'zhihu-answer', label: 'Zhihu Answer', format: 'Answer', group: 'long-form' },
] as const;

export type RepurposePlatform = (typeof AI_PLATFORMS)[number]['id'];
export type AiPlatformDefinition = (typeof AI_PLATFORMS)[number];

export const AI_PLATFORM_GROUPS = [
  {
    label: 'Social',
    description: 'Fast platform-native posts and captions.',
    platforms: ['twitter-thread', 'linkedin-post', 'instagram-post', 'facebook-post', 'xiaohongshu-post'],
  },
  {
    label: 'Long-form',
    description: 'Articles, answers, and durable thought leadership.',
    platforms: ['medium-article', 'wechat-article', 'zhihu-answer'],
  },
  {
    label: 'Email',
    description: 'Newsletter-ready sections and issue drafts.',
    platforms: ['newsletter'],
  },
  {
    label: 'Community',
    description: 'Launch notes and community posts for niche audiences.',
    platforms: ['reddit-post', 'hacker-news-post', 'indie-hackers-post', 'jike-post'],
  },
] as const;
