"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CONNECTOR = '_';
const SYSTEM_IDENTIFIER = 'system';
const ELEMENT_IDENTIFIER = 'element';
const VALUE_IDENTIFIER = 'value';
const TAXONOMY_TERM_IDENTIFIER = 'term';
const ELEMENT_OPTION_IDENTIFIER = 'option';
const MULTI_ELEMENT_IDENTIFIER = `${ELEMENT_IDENTIFIER}s`;
const LANGUAGE_LINK_EXTENSION_IDENTIFIER = 'language_link';
const ITEM_IDENTIFIER = 'item';
const TAXONOMY_IDENTIFIER = 'taxonomy';
const TYPE_IDENTIFIER = 'type';
const defaultPluginNamingConfiguration = {
    prefix: `kontent`,
};
/**
 * Retrieve ID string for Gatsby's CreateNodeId method for specified Kontent item language variant.
 * @param codename Codename because modular content is using them for linking items
 * @param preferredLanguage Preferred language of the language variant.
 * @param config Optional parameter with extra configuration.
 */
const getKontentItemNodeStringForId = (codename, preferredLanguage, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${preferredLanguage}${CONNECTOR}${codename}`;
exports.getKontentItemNodeStringForId = getKontentItemNodeStringForId;
const getKontentItemNodeTypeName = (type, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}`;
exports.getKontentItemNodeTypeName = getKontentItemNodeTypeName;
const getKontentItemInterfaceName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}`;
exports.getKontentItemInterfaceName = getKontentItemInterfaceName;
const getKontentItemSystemElementTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;
exports.getKontentItemSystemElementTypeName = getKontentItemSystemElementTypeName;
const getKontentItemElementTypeNameByType = (type, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}${CONNECTOR}${VALUE_IDENTIFIER}`;
exports.getKontentItemElementTypeNameByType = getKontentItemElementTypeNameByType;
const getKontentItemElementValueTypeNameByType = (type, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}`;
const getKontentItemElementsSchemaTypeName = (type, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}${CONNECTOR}${MULTI_ELEMENT_IDENTIFIER}`;
exports.getKontentItemElementsSchemaTypeName = getKontentItemElementsSchemaTypeName;
const getKontentItemLanguageLinkExtensionName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${LANGUAGE_LINK_EXTENSION_IDENTIFIER}`;
exports.getKontentItemLanguageLinkExtensionName = getKontentItemLanguageLinkExtensionName;
const getKontentTaxonomyNodeStringForCodeName = (codename, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${codename}`;
exports.getKontentTaxonomyNodeStringForCodeName = getKontentTaxonomyNodeStringForCodeName;
const getKontentTaxonomyTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}`;
exports.getKontentTaxonomyTypeName = getKontentTaxonomyTypeName;
const getKontentTaxonomySystemElementTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;
const getKontentTaxonomyTermTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${TAXONOMY_TERM_IDENTIFIER}`;
const getKontentTypeNodeStringForCodeName = (codename, config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${codename}`;
exports.getKontentTypeNodeStringForCodeName = getKontentTypeNodeStringForCodeName;
const getKontentTypeTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}`;
exports.getKontentTypeTypeName = getKontentTypeTypeName;
const getKontentTypeSystemElementTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;
const getKontentTypeElementTypeName = (config = defaultPluginNamingConfiguration) => `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${ELEMENT_IDENTIFIER}`;
const getKontentTypeElementOptionTypeName = (config = defaultPluginNamingConfiguration) => `${getKontentTypeElementTypeName(config)}${CONNECTOR}${ELEMENT_OPTION_IDENTIFIER}`;
const getKontentItemsSchemaNamingConfiguration = (config = defaultPluginNamingConfiguration) => {
    const template = fs.readFileSync(path.join(__dirname, 'template.items.schema.gql'), 'utf8');
    return (template
        .replace(/__KONTENT_ITEM_INTERFACE__/g, getKontentItemInterfaceName(config))
        .replace(/__KONTENT_ITEM_SYSTEM_TYPE__/g, getKontentItemSystemElementTypeName(config))
        // elements
        .replace(/__KONTENT_ITEM_TEXT_ELEMENT__/g, getKontentItemElementTypeNameByType('text', config))
        .replace(/__KONTENT_ITEM_RICH_TEXT_ELEMENT__/g, getKontentItemElementTypeNameByType('rich_text', config))
        .replace(/__KONTENT_ITEM_NUMBER_ELEMENT__/g, getKontentItemElementTypeNameByType('number', config))
        .replace(/__KONTENT_ITEM_MULTIPLE_CHOICE_ELEMENT__/g, getKontentItemElementTypeNameByType('multiple_choice', config))
        .replace(/__KONTENT_ITEM_DATE_TIME_ELEMENT__/g, getKontentItemElementTypeNameByType('date_time', config))
        .replace(/__KONTENT_ITEM_ASSET_ELEMENT__/g, getKontentItemElementTypeNameByType('asset', config))
        .replace(/__KONTENT_ITEM_MODULAR_CONTENT_ELEMENT__/g, getKontentItemElementTypeNameByType('modular_content', config))
        .replace(/__KONTENT_ITEM_CUSTOM_ELEMENT_ELEMENT__/g, getKontentItemElementTypeNameByType('custom', config))
        .replace(/__KONTENT_ITEM_TAXONOMY_ELEMENT__/g, getKontentItemElementTypeNameByType('taxonomy', config))
        .replace(/__KONTENT_ITEM_URL_SLUG_ELEMENT__/g, getKontentItemElementTypeNameByType('url_slug', config))
        // element values
        .replace(/__KONTENT_ELEMENT_MULTIPLE_CHOICE_VALUE__/g, getKontentItemElementValueTypeNameByType('multiple_choice', config))
        .replace(/__KONTENT_ELEMENT_ASSET_VALUE__/g, getKontentItemElementValueTypeNameByType('asset', config))
        .replace(/__KONTENT_ELEMENT_TAXONOMY_VALUE__/g, getKontentItemElementValueTypeNameByType('taxonomy', config))
        .replace(/__KONTENT_ELEMENT_RICH_TEXT_IMAGE_VALUE__/g, `${getKontentItemElementValueTypeNameByType('rich_text', config)}${CONNECTOR}link`)
        .replace(/__KONTENT_ELEMENT_RICH_TEXT_LINK_VALUE__/g, `${getKontentItemElementValueTypeNameByType('rich_text', config)}${CONNECTOR}image`)
        // extensions
        .replace(/__KONTENT_ITEM_LANGUAGE_EXTENSION__/g, getKontentItemLanguageLinkExtensionName(config)));
};
exports.getKontentItemsSchemaNamingConfiguration = getKontentItemsSchemaNamingConfiguration;
const getKontentTaxonomiesSchemaNamingConfiguration = (config = defaultPluginNamingConfiguration) => {
    const template = fs.readFileSync(path.join(__dirname, 'template.taxonomies.schema.gql'), 'utf8');
    return template
        .replace(/__KONTENT_TAXONOMY_NAME__/g, getKontentTaxonomyTypeName(config))
        .replace(/__KONTENT_TAXONOMY_SYSTEM_TYPE__/g, getKontentTaxonomySystemElementTypeName(config))
        .replace(/__KONTENT_TAXONOMY_TERM_TYPE__/g, getKontentTaxonomyTermTypeName(config));
};
exports.getKontentTaxonomiesSchemaNamingConfiguration = getKontentTaxonomiesSchemaNamingConfiguration;
const getKontentTypesSchemaNamingConfiguration = (config = defaultPluginNamingConfiguration) => {
    const template = fs.readFileSync(path.join(__dirname, 'template.types.schema.gql'), 'utf8');
    return template
        .replace(/__KONTENT_TYPE_NAME__/g, getKontentTypeTypeName(config))
        .replace(/__KONTENT_TYPE_SYSTEM_TYPE__/g, getKontentTypeSystemElementTypeName(config))
        .replace(/__KONTENT_TYPE_ELEMENT_TYPE__/g, getKontentTypeElementTypeName(config))
        .replace(/__KONTENT_TYPE_ELEMENT_OPTIONS_TYPE__/g, getKontentTypeElementOptionTypeName(config));
};
exports.getKontentTypesSchemaNamingConfiguration = getKontentTypesSchemaNamingConfiguration;
//# sourceMappingURL=naming.js.map