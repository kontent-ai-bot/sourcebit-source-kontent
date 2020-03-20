"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const addPreferredLanguageProperty = (items, language) => {
  for (const item of items) {
    item["preferred_language"] = language;
  }
  return items;
};
const alterRichTextElements = items => {
  const richTextElements = items
    .flatMap(i => Object.values(i.elements))
    .filter(element => element.type === "rich_text");
  for (const element of richTextElements) {
    element.links = Object.keys(element.links).map(key => {
      element.links[key]["link_id"] = key;
      return element.links[key];
    });
    element.images = Object.keys(element.images).map(key => {
      // key is stored in image_id
      return element.images[key];
    });
  }
};
const getKontentItemLanguageVariantArtifact = kontentItem => {
  const nodeData = {
    ...kontentItem
  };
  return nodeData;
};
const sourceNodes = async options => {
  var nodesData = [];
  for (const language of options.languageCodenames) {
    const kontentItems = await client_1.loadAllKontentItems(
      options.projectId,
      language
    );
    addPreferredLanguageProperty(kontentItems, language);
    alterRichTextElements(kontentItems);
    for (const kontentItem of kontentItems) {
      const nodeData = getKontentItemLanguageVariantArtifact(kontentItem);
      nodesData.push(nodeData);
      // Pass data to stackbit
    }
  }
  return nodesData;
};
exports.sourceNodes = sourceNodes;
//# sourceMappingURL=sourceNodes.js.map
