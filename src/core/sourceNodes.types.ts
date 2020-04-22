import {
  CustomPluginOptions,
  KontentType,
  KontentTypeElementArrayItem,
  KontentTypeElementsObject,
} from './types';
import { loadAllKontentTypes } from './client';

const getKontentTypeArtifact = (
  kontentType: KontentType,
): KontentType => {
  const nodeData: KontentType = {
    ...kontentType,
  };
  return nodeData;
};

const transformElementObjectToArray = (types: Array<KontentType>): void => {
  types.forEach(type => {
    (type.elements as KontentTypeElementArrayItem[]) = Object.keys(
      type.elements,
    ).map((key: string) => {
      (type.elements as KontentTypeElementsObject)[key].codename = key;
      return (type.elements as KontentTypeElementsObject)[key];
    });
  });
};

const sourceNodes = async (
  options: CustomPluginOptions,
): Promise<Array<KontentType>> => {
  const nodes = Array<KontentType>();
  const kontentTypes = await loadAllKontentTypes(options);
  transformElementObjectToArray(kontentTypes);
  for (const kontentType of kontentTypes) {
    const nodeData = getKontentTypeArtifact(kontentType);
    nodes.push(nodeData);
  }
  return nodes;
};

export { sourceNodes as kontentTypesSourceNodes };
