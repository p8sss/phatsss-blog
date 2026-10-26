const blogPlugin = require('@docusaurus/plugin-content-blog').default;
const {validateOptions} = require('@docusaurus/plugin-content-blog');
const {normalizePluginOptions} = require('@docusaurus/utils-validation');

function cleanText(src) {
  return String(src || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~`\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(content, hasTruncateMarker) {
  const source = String(content || '');
  const pre = hasTruncateMarker
    ? source.split('<!-- truncate -->')[0] || source
    : source;
  let excerpt = cleanText(pre);
  if (excerpt.length > 220) {
    excerpt = `${excerpt.slice(0, 220)}…`;
  }
  return excerpt;
}

/**
 * Exposes the blog tags (categories) and a lightweight post list as global
 * data so any page (blog list, bookmarks, sidebar) can render them via
 * `useGlobalData()`.
 *
 * Docusaurus' blog plugin does not serialize this data into global data, so we
 * reuse its `loadContent` and publish only the slices we need.
 */
module.exports = function blogTagsPlugin(context, options) {
  return {
    name: 'docusaurus-blog-tags',
    async loadContent() {
      const pluginOptions = validateOptions({
        validate: normalizePluginOptions,
        options: {id: 'default', ...options},
      });
      const plugin = await blogPlugin(context, pluginOptions);
      const content = await plugin.loadContent();

      const blogPosts = (content.blogPosts || []).map((post) => {
        const {metadata} = post;
        const firstAuthor = Array.isArray(metadata.authors)
          ? metadata.authors[0]
          : undefined;
        return {
          slug: post.id,
          title: metadata.title,
          permalink: metadata.permalink,
          date: metadata.date,
          description: metadata.description || '',
          excerpt: buildExcerpt(post.content, metadata.hasTruncateMarker),
          tags: (metadata.tags || []).map((tag) => ({
            label: tag.label,
            permalink: tag.permalink,
          })),
          language: metadata.frontMatter?.language ?? 'en',
          readingTime: metadata.readingTime ?? 0,
          author: firstAuthor
            ? {
                name: firstAuthor.name,
                title: firstAuthor.title,
                imageURL: firstAuthor.imageURL,
              }
            : undefined,
        };
      });

      return {
        blogTags: content.blogTags || {},
        blogPosts,
      };
    },
    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      setGlobalData(content);
    },
  };
};
