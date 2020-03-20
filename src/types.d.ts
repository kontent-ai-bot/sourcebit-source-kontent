export interface CustomPluginOptions {
    projectId: string;
    languageCodenames: string[];
} 

interface PluginNamingConfiguration {
  prefix: string;
}

export interface KontentItemElement {
  name: string;
  type: string;
  value: string | number | string[];
  images: { [key: string]: RichTextElementImage } | RichTextElementImage[];
  links: { [key: string]: RichTextElementLink } | RichTextElementLink[];
  modular_content: string[];
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

export interface KontentItem  {
  system: {
    codename: string;
    id: string;
    language: string;
    last_modified: Date;
    name: string;
    type: string;
  };
  elements: KontentItemElement[];
  preferred_language: string;
}

export interface KontentType {
  system: {
    id: string;
    name: string;
    codename: string;
    last_modified: Date;
  };
  elements:
  {
    [key: string]: {
      name: string;
      type: string;
    };
  };
}