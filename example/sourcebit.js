module.exports = {
  plugins: [
    {
      module: require('/Users/martinm/Documents/git-projects/sourcebit-source-kontent'),
      options: {
        kontentProjectId: '00676a8d-358c-0084-f2f2-33ed466c480a',
        kontentLanguageCodenames: [
          'en-US',
          'cs-CZ'
        ]
      }
    },
    {
      module: require('sourcebit-target-jekyll'),
      options: {
        writeFile: function(entry,utils) {
        // This function is invoked for each entry and its return value determines
        // whether the entry will be written to a file. When an object with `content`,
        // `format` and `path` properties is returned, a file will be written with
        // those parameters. If a falsy value is returned, no file will be created.
        const { __metadata: meta, ...fields } = entry;
        if (!meta) return;
        const { createdAt = '', modelName, projectId, source } = meta;
        if (modelName === 'article' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, 'content': content, layout, ...frontmatterFields } = entry;
          return {
            content: {
              body: fields['content'],
              frontmatter: { ...frontmatterFields, layout: 'article-layout' },
            },
            format: 'frontmatter-md',
            path: '_article/' + createdAt.substring(0, 10) + '-' + utils.slugify(fields['title']) + '.md'
          };
        }
        if (modelName === 'author' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/author.json'
          };
        }
        if (modelName === 'category' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/category.json'
          };
        }
        if (modelName === 'menu' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/menu.json'
          };
        }
        if (modelName === 'menu_item' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/menu_item.json'
          };
        }
        if (modelName === 'page' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/page.json'
          };
        }
        if (modelName === 'site_metadata' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/site_metadata.json'
          };
        }
        if (modelName === 'tag' && projectId === '00676a8d-358c-0084-f2f2-33ed466c480a' && source === 'sourcebit-source-kontent') {
          const { __metadata, ...fields } = entry;
          return {
            append: false,
            content: fields,
            format: 'json',
            path: '_data/tag.json'
          };
        }
        }
      }
    }
  ]
}
