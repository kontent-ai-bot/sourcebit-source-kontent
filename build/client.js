"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const _ = __importStar(require("lodash"));
const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";
const continuationHeaderName = "x-continuation";
const loadAllKontentItems = async (projectId, language) => {
  let continuationToken = "";
  const items = [];
  do {
    const headers = {
      [continuationHeaderName]: continuationToken
    };
    const response = await axios_1.default.get(
      `${KontentDeliveryProductionDomain}/${projectId}/items-feed?language=${language}`,
      {
        headers
      }
    );
    const union = _.unionBy(
      response.data.items,
      Object.values(response.data.modular_content),
      "system.codename"
    );
    items.push(...union);
    continuationToken = response.headers[continuationHeaderName];
  } while (continuationToken);
  return items;
};
exports.loadAllKontentItems = loadAllKontentItems;
const loadAllKontentTypes = async projectId => {
  const response = await axios_1.default.get(
    `${KontentDeliveryProductionDomain}/${projectId}/types`
  );
  return response.data.types;
};
exports.loadAllKontentTypes = loadAllKontentTypes;
//# sourceMappingURL=client.js.map
