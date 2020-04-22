# Example app using local sourcebit-source-kontent

## How to create a new Sourcebit project using local sourcebit-source-kontent plugin
**Prerequisites:** The source plugin is built (for more info see ../readme.md).

1. Edit `example/local-plugins.json` module property to fit your file system structure e.g: `/Users/Martin/Documents/Projects/sourcebit-source-kontent`. There is a known issue this is not working on the Windows environment right now.

1. Run:

```
npx create-sourcebit --plugins=local-plugins.json
```
3. Follow the interactive wizard 
