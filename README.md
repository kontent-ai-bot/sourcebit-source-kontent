# Sourcebit Source Kontent plugin and an Example app (console.log for a now)

## How to run sourcebit fetch using local sourcebit-source-kontent

1.Run

```
cd example
node index.js
```

## How to create a new Sourcebit project using local sourcebit-source-kontent via npx create-sourcebit

1. Run:

```
npm i
npm run build
cd example
```

2. Edit `example/local-plugins.json` module property to fit your file system structure e.g: `/Users/Martin/Documents/Projects/sourcebit-source-kontent`
3. Run:

```
npx create-sourcebit --plugins=local-plugins.json
```
