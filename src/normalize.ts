import { KontentType, KontentTypeElementArrayItem, KontentItem } from "./core/types.d";
import pkg from "./../package.json";

const projectEnvironment = "master";

export interface KontentOptions {
    projectId: string,
    languageCodenames: [string],
}

// https://github.com/stackbithq/sourcebit/wiki/Data-normalization#models
export interface NormalizedModel {
    source: string;
    modelName: string;
    modelLabel: string;
    projectId: string;
    projectEnvironment: string;
    fieldNames: string[];
}

export interface NormalizedEntry {
    [key:string]: any,
    __metadata: NormalizedEntryMetadata
}

// https://github.com/stackbithq/sourcebit/wiki/Data-normalization#models
export interface NormalizedEntryMetadata {
    id: string,
    source: string,
    modelName: string,
    modelLabel: string,
    projectId: string,
    projectEnvironment: string,
    createdAt: string,
    updatedAt: string
}

export interface ElementValues {
    [key:string]: string | number | string[]
}

const getNormalizedModels = (types: KontentType[], options: KontentOptions): NormalizedModel[] => {
    const normalizedModels = types.map(type => {
        return getNormalizedModel(type, options);
    })

    return normalizedModels;
}

const getNormalizedModel = (type: KontentType, options: KontentOptions): NormalizedModel => {
    const model = {
        source: pkg.name,
        modelName: type.system.codename,
        modelLabel: type.system.name,
        projectId: options.projectId,
        projectEnvironment,
        fieldNames: (type.elements as KontentTypeElementArrayItem[]).map(element => element.codename)
      };

      return model
}

const getNormalizedEntries = (items: KontentItem[], models: NormalizedModel[], options: KontentOptions): NormalizedEntry[] => {
    const normalizedEntries = items.map(item => {
        const model = models.filter(m => m.modelName === item.system.type)[0];
        const normalizedEntry = getNormalizedEntry(item, model, options);
        return normalizedEntry;
    });

    return normalizedEntries;
}

const getNormalizedEntry = (item: KontentItem, model: NormalizedModel, options: KontentOptions): NormalizedEntry => {
    const normalizedEntryMetadata: NormalizedEntryMetadata = {
        source: pkg.name,
        id: item.system.codename,
        modelName: model.modelName,
        modelLabel: model.modelLabel,
        projectId: options.projectId,
        projectEnvironment,
        createdAt: item.system.last_modified.toString(),
        updatedAt: item.system.last_modified.toString()
    }

    let elementValues: ElementValues = {};
    Object.keys(item.elements).forEach(key => {
        elementValues[key] = item.elements[key].value;
      });

    return {
        ...elementValues,
        __metadata: normalizedEntryMetadata
      };
}
  
export { getNormalizedModels, getNormalizedEntries };