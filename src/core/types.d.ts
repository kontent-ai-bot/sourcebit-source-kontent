/**
 * The plugin options.
 */
export interface CustomPluginOptions {
  projectId: string;
  languageCodenames: string[];
  authorizationKey: string = null;
  usePreviewUrl: boolean = false;
  proxy: {
    deliveryDomain: string;
    previewDeliveryDomain: string;
  };
}

export interface CustomCreateSchemaCustomizationArgs
  extends CreateSchemaCustomizationArgs {
  schema: {
    buildObjectType: Function;
  };
}

export interface PluginNamingConfiguration {
  prefix: string;
}

export interface KontentItemElement {
  name: string;
  type: string;
  value: string | number | string[] | AssetElementValue[] | MultipleChoiceOption[] | TaxonomyTerm[];
  images: { [key: string]: RichTextElementImage } | RichTextElementImage[];
  links: { [key: string]: RichTextElementLink } | RichTextElementLink[];
  modular_content: string[];
}

interface AssetElementValue {
  name: string;
  type: string;
  size: number;
  description: string;
  url: string;
  width?: number;
  height?: number;
}

interface MultipleChoiceOption {
  name: string;
  codename: string;
}

interface TaxonomyTerm {
  name: string;
  codename: string;
}

export interface RichTextElementImage {
  image_id: string;
  url: string;
  description: string;
  height: number;
  width: number;
}

export interface RichTextElementLink {
  link_id: string;
  codename: string;
  type: string;
  urlSlug: string;
}

export interface KontentItem {
  system: {
    codename: string;
    id: string;
    language: string;
    last_modified: Date;
    name: string;
    type: string;
  };
  elements: {
    [key: string]:
    KontentItemElement;
  };
  [PREFERRED_LANGUAGE_IDENTIFIER]: string;
}

export interface KontentTaxonomyTerm {
  name: string;
  codename: string;
  terms: KontentTaxonomyTerm[];
}

export interface KontentTypeElementOption {
  name: string;
  codename: string;
}

export interface KontentTypeElementsObject {
  [key: string]: KontentTypeElementArrayItem;
}

export interface KontentTypeElementArrayItem {
  codename: string;
  name: string;
  type: string;
  taxonomy_group: string;
  options: KontentTypeElementOption[];
}

export interface KontentType extends NodeInput {
  system: {
    id: string;
    name: string;
    codename: string;
    last_modified: date;
  };
  elements: KontentTypeElementsObject | KontentTypeElementArrayItem[];
}
