import {getResiteLayer} from './annotations';
import {RESITE_LABEL_GAP} from '../constants';

export const getResiteLabelsContainerHeight = (restrictionSites) => {
  const resiteLabelLayers = restrictionSites
    .map((site, index, arr) => {
      return getResiteLayer(restrictionSites, index)
  });
  const mostLayers = Math.max(...resiteLabelLayers);
  const resiteLabelsContainerHeight = (1 + RESITE_LABEL_GAP) * (mostLayers > 0 ? mostLayers + 1 : 1);
  return resiteLabelsContainerHeight;
}
