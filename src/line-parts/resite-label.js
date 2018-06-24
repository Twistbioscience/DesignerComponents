import {
  RESITE_LABEL_GAP,
  RESITE_BOX_HOR_PADDING,
  RESITE_BOX_VERT_PADDING,
  LINE_PADDING_TOP
} from '../constants';

import {getAnnotationLayer} from '../rendering/annotations'

const RestrictionSiteLabel = ({site, index, arr, config, startIndex, maxResiteLayer}) => {
  const layer = getAnnotationLayer(arr, index);
  const width = RESITE_BOX_HOR_PADDING + (site.endIndex - site.startIndex + 1) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const x = (site.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE + 1;
  const y =
    (maxResiteLayer - layer + 1) * (1 + RESITE_LABEL_GAP) +
    LINE_PADDING_TOP;
  return (
    <g key={`resite-label-${index}`}>
      <path
        d={'M ' + x.toString() + ' ' + y.toString() + 'H ' + (x + width).toString()}
        fill={site.color}
        stroke={site.color}
        strokeWidth="1"
      />
    </g>
  );
};

export default RestrictionSiteLabel;
