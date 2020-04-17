"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rax = __importStar(require("retry-axios"));
const axios_1 = __importDefault(require("axios"));
const _ = __importStar(require("lodash"));
const KontentDeliveryProductionDomain = 'https://deliver.kontent.ai';
const KontentDeliveryPreviewDomain = 'https://preview-deliver.kontent.ai';
const continuationHeaderName = 'x-continuation';
const authorizationHeaderName = 'authorization';
rax.attach();
const getDomain = (options) => options.usePreviewUrl
    ? KontentDeliveryPreviewDomain
    : KontentDeliveryProductionDomain;
const logRetryAttempt = (err) => {
    var _a;
    const cfg = rax.getConfig(err);
    console.log(`Error axios request:(url: ${(_a = err.response) === null || _a === void 0 ? void 0 : _a.config.url}) ${err.message}`);
    console.log(`Retry attempt #${cfg === null || cfg === void 0 ? void 0 : cfg.currentRetryAttempt}`);
};
const ensureAuthorizationHeader = (config, headers) => {
    if (!config.authorizationKey) {
        return headers || {};
    }
    if (headers) {
        headers.authorization = `Bearer ${config.authorizationKey}`;
        return headers;
    }
    else {
        return {
            authorization: `Bearer ${config.authorizationKey}`,
        };
    }
};
const loadAllKontentItems = async (config, language) => {
    let continuationToken = '';
    const items = [];
    do {
        const headers = ensureAuthorizationHeader(config);
        headers[continuationHeaderName] = continuationToken;
        try {
            const response = await axios_1.default.get(`${getDomain(config)}/${config.projectId}/items-feed?language=${language}`, {
                headers,
                raxConfig: {
                    onRetryAttempt: logRetryAttempt,
                },
            });
            const union = _.unionBy(response.data.items, Object.values(response.data.modular_content), 'system.codename');
            items.push(...union);
            continuationToken = response.headers[continuationHeaderName];
        }
        catch (error) {
            console.error(`Items load for project ${config.projectId} on language ${language} failed with error: ${JSON.stringify(error)}`);
        }
    } while (continuationToken);
    return items;
};
exports.loadAllKontentItems = loadAllKontentItems;
const loadAllKontentTypes = async (config) => {
    const response = await axios_1.default.get(`${getDomain(config)}/${config.projectId}/types`, {
        headers: ensureAuthorizationHeader(config),
        raxConfig: {
            onRetryAttempt: logRetryAttempt,
        },
    });
    return response.data.types;
};
exports.loadAllKontentTypes = loadAllKontentTypes;
//# sourceMappingURL=client.js.map