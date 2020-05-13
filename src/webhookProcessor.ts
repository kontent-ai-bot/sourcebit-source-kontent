import { CustomPluginOptions, KontentItem } from "./core/types"
import * as client from "./core/client";
import { addPreferredLanguageProperty, alterRichTextElements, getKontentItemLanguageVariantArtifact } from "./core/sourceNodes.items";
import { IWebhookDeliveryResponse, IWebhookMessage } from '@kentico/kontent-webhook-helper';

interface ISourcebitAPI {
    debug: (message: string) => void;
    log: (message: string) => void;
}

const parseKontentWebhookBody = (parsedBody: IWebhookDeliveryResponse): IWebhookDeliveryResponse | null => {
  const isCorrectStructure = parsedBody?.data?.items?.every((item: any)=> item.language && item.id)
    && parsedBody?.message?.api_name
    && parsedBody?.message?.project_id
    && parsedBody?.message?.operation !== null;

  if (isCorrectStructure) {
    return parsedBody;
  }

  return null;
}

const isKontentSupportedWebhook = (message: IWebhookMessage, projectId: string): boolean => {
  const isCorrectProject = message.project_id === projectId;
  const isPreviewWebhook = 'delivery_preview' === message.api_name
    && ['upsert', 'archive'].includes(message.operation);
  const isBuildWebhook = 'delivery_production' === message.api_name
    && ['publish', 'unpublish'].includes(message.operation);
  const isCorrectMessageType = message.type == 'content_item_variant'

  return isCorrectProject
    && (isPreviewWebhook || isBuildWebhook)
    && isCorrectMessageType
};


const handleUpsertItem = async (
    api: ISourcebitAPI,
    pluginConfig: CustomPluginOptions,
    webhookBody: IWebhookDeliveryResponse,
    existingItems: Array<KontentItem>,
  ) => {
    const itemInfo = webhookBody?.data.items[0];
  
    if (!pluginConfig.languageCodenames.includes(itemInfo.language)) {
      api.debug(`Cant find specified language ${itemInfo.language} in plugin configuration`);
    }
  
    // TODO could be optimized to by checking the fallback structure and save some requests
    // not recreate the ones that has different system.language
    // be careful on fallback language - verify cz->de->en fallbacks
  
    for (const lang of pluginConfig.languageCodenames) {
      const kontentItem = await client.loadKontentItem(itemInfo.id, lang, pluginConfig, true);
      if (kontentItem === undefined) {
        api.debug(`Kontent item (${itemInfo.id}) language variant (${lang}) not found on the kontent delivery API for update`);
        continue;
      }
      addPreferredLanguageProperty([kontentItem], lang);
      alterRichTextElements([kontentItem]);
      const nodeData = getKontentItemLanguageVariantArtifact(kontentItem);

      // replace item given language with udpated data for given language
      existingItems = existingItems.map(item => {
        if (item.system.id === nodeData.system.id && item.system.language === nodeData.system.language) {
          return nodeData;
        }
      }) as KontentItem[];
    }
  }

const handleDeleteItem = async (
  api: ISourcebitAPI,
  pluginConfig: CustomPluginOptions,
  webhookBody: IWebhookDeliveryResponse,
  existingItems: Array<KontentItem>,
) => {

  const itemInfo = webhookBody?.data.items[0];

  if (!pluginConfig.languageCodenames.includes(itemInfo.language)) {
    api.debug(`Cant find specified language ${itemInfo.language} in plugin configuration`);
    return [];
  }

  // TODO could be optimized to by checking the fallback structure and save some requests
  // not recreate the ones that has different system.language
  // be careful on fallback language - verify cz->de->en fallbacks

  for (const lang of pluginConfig.languageCodenames) {
    const kontentItem = await client.loadKontentItem(itemInfo.id, lang, pluginConfig, true);
    if (kontentItem === undefined) { //item  was deleted
      // delete item with given language and id
      existingItems = existingItems.filter(item => {
        if (!(item.system.id === itemInfo.id && item.system.language === itemInfo.language)) {
          return item;
        }
      });
      continue;
    } else { // fallback version still available
      addPreferredLanguageProperty([kontentItem], lang);
      alterRichTextElements([kontentItem]);
      const nodeData = getKontentItemLanguageVariantArtifact(kontentItem);
      existingItems.push(nodeData);
    }
  }
}

const handleIncomingWebhook = async (
  api: ISourcebitAPI,
  pluginConfig: CustomPluginOptions,
  webhookBody: IWebhookDeliveryResponse,
  existingItems: Array<KontentItem>,
): Promise<void> => {

  const webhook = parseKontentWebhookBody(webhookBody);

  if (webhook === null) {
    api.debug('Webhook ignored - webhook does not come from Kontent');
    return;
  }

  if (!isKontentSupportedWebhook(webhook.message, pluginConfig.projectId)) {
    api.debug('This Kontent webhook is not handled by the Gatsby source kontent source plugin');
    return;
  }

  api.debug(`Handling ${webhook.message.operation} from ${webhook.message.api_name} API`);
  if (webhook.data.items.length > 1) {
    api.log(`Webhook contains more than one item! - contains (${webhook.data.items.length})`)
  }

  if (webhook.message.api_name === 'delivery_preview') {

    // TODO: Webhook header signature (once headers are available)
    // use signatureHelper '@kentico/kontent-webhook-helper'
    // https://github.com/gatsbyjs/gatsby/issues/23593

    if (webhook.message.operation === "upsert") {
      await handleUpsertItem(api, pluginConfig, webhookBody, existingItems);
    }

    if (webhook.message.operation === "archive") {
      await handleDeleteItem(api, pluginConfig, webhookBody, existingItems);
    }
  } else if (webhook.message.api_name === 'delivery_production') {

    // TODO: Webhook header signature (once headers are available)
    // use signatureHelper '@kentico/kontent-webhook-helper'
    // https://github.com/gatsbyjs/gatsby/issues/23593

    if (webhook.message.operation === "publish") {
      await handleUpsertItem(api, pluginConfig, webhookBody, existingItems);
    }

    if (webhook.message.operation === "unpublish") {
      await handleDeleteItem(api, pluginConfig, webhookBody, existingItems);
    }
  } else {
    api.debug(`Webhook is not supported yet!`);
    api.debug(JSON.stringify(webhook, null, 2));
    return;
  }

}

export {
  handleIncomingWebhook
}