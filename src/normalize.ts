import { KontentType, KontentTypeElementArrayItem, KontentItem, RichTextElementImage, AssetElementValue, KontentItemElement, MultipleChoiceOption, TaxonomyTerm } from "./core/types.d";
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

// https://github.com/stackbithq/sourcebit/wiki/Data-normalization#models

export interface NormalizedEntry {
    [key:string]: any,
    __metadata: NormalizedEntryMetadata
}

// https://github.com/stackbithq/sourcebit/wiki/Data-normalization#models
export interface NormalizedAsset {
    title: string,
    contentType: string,
    fileName: string,
    url: string,
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
    [key:string]: string | number | string[] | AssetElementValue[] | MultipleChoiceOption[] | TaxonomyTerm[];
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

const getNormalizedAssets = (items: KontentItem[], models: NormalizedModel[]): Array<NormalizedAsset> => {
    let normalizedAssets = Array<NormalizedAsset>();

    items.map(item => {
        const model = models.filter(m => m.modelName === item.system.type)[0];
        const normalizedAssetsForItem = getNormalizedAssetsForItem(item, model);
        normalizedAssets = normalizedAssets.concat(normalizedAssetsForItem);
    });

    return normalizedAssets;
}

const getNormalizedAssetsForItem = (item: KontentItem, model: NormalizedModel): Array<NormalizedAsset> => {

    const assetModelName = '__asset';
    let normalizedAssetsForItem = Array<NormalizedAsset>();

    let elements = Array<KontentItemElement>();
    Object.keys(item.elements).forEach(key => {
        elements.push(item.elements[key]);
    });

    // get assets from richtext elements
    const richtextElements = elements.filter(elemenet => elemenet.type === 'rich_text');

    richtextElements.map(element => {
        const images = element.images as Array<RichTextElementImage>;
        images.map(image => {
            const metadata: NormalizedEntryMetadata = {
                source: pkg.name,
                id: image.url,
                modelName: assetModelName,
                modelLabel: model.modelLabel,
                projectId: model.projectId,
                projectEnvironment: projectEnvironment,
                createdAt: item.system.last_modified.toString(),
                updatedAt: item.system.last_modified.toString()
            };

            const normalizedAsset: NormalizedAsset =  {
                title: getAssetNameFromUrl(image.url),
                contentType: getImageMimeTypeFromUrl(image.url),
                fileName: getAssetNameFromUrl(image.url),
                url: image.url,
                __metadata: metadata
            };

            normalizedAssetsForItem.push(normalizedAsset);
        });
    });

    // get assets from asset elements
    const assetElements = elements.filter(elemenet => elemenet.type === 'asset');

    assetElements.map(element => {
        const assetsElementValue = element.value as Array<AssetElementValue>;

        const normalizedAssetsForElement: Array<NormalizedAsset> = assetsElementValue.map(asset => {
            const metadata: NormalizedEntryMetadata = {
                source: pkg.name,
                id: asset.url,
                modelName: assetModelName,
                modelLabel: model.modelLabel,
                projectId: model.projectId,
                projectEnvironment: projectEnvironment,
                createdAt: item.system.last_modified.toString(),
                updatedAt: item.system.last_modified.toString()
            };

            return {
                title: asset.name,
                contentType: asset.type,
                fileName: asset.name,
                url: asset.url,
                __metadata: metadata
            };
        });

        normalizedAssetsForItem = normalizedAssetsForItem.concat(normalizedAssetsForElement);
    });

    return normalizedAssetsForItem;
}

const getAssetNameFromUrl = (assetUrl: string): string => {
    return assetUrl.substring(assetUrl.lastIndexOf('/') + 1);
}

const getImageMimeTypeFromUrl = (assetUrl: string): string => {
    const extension = assetUrl.substring(assetUrl.lastIndexOf('.') + 1)
    return `image\\${extension}`;
}
  
export { getNormalizedModels, getNormalizedEntries, getNormalizedAssets };