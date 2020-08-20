import { assoc, pipe, isNil } from 'ramda';
import {
  createEntity,
  listEntities,
  loadEntityById,
  timeSeriesEntities,
  FROM_START,
  UNTIL_END,
} from '../database/grakn';
import { BUS_TOPICS } from '../config/conf';
import { notify } from '../database/redis';
import { ABSTRACT_STIX_DOMAIN_OBJECT, ENTITY_TYPE_CAMPAIGN } from '../utils/idGenerator';

export const findById = (campaignId) => {
  return loadEntityById(campaignId, ENTITY_TYPE_CAMPAIGN);
};

export const findAll = (args) => {
  return listEntities([ENTITY_TYPE_CAMPAIGN], ['name', 'description', 'aliases'], args);
};

// region time series
export const campaignsTimeSeries = (args) => {
  return timeSeriesEntities(ENTITY_TYPE_CAMPAIGN, [], args);
};

export const campaignsTimeSeriesByEntity = (args) => {
  const filters = [{ isRelation: true, type: args.relationship_type, value: args.objectId }];
  return timeSeriesEntities(ENTITY_TYPE_CAMPAIGN, filters, args);
};
// endregion

export const addCampaign = async (user, campaign) => {
  const campaignToCreate = pipe(
    assoc('first_seen', isNil(campaign.first_seen) ? new Date(FROM_START) : campaign.first_seen),
    assoc('last_seen', isNil(campaign.last_seen) ? new Date(UNTIL_END) : campaign.last_seen)
  )(campaign);
  const created = await createEntity(user, campaignToCreate, ENTITY_TYPE_CAMPAIGN);
  return notify(BUS_TOPICS[ABSTRACT_STIX_DOMAIN_OBJECT].ADDED_TOPIC, created, user);
};
