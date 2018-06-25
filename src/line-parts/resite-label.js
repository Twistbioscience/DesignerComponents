import {
  RESITE_LABEL_GAP,
  RESITE_BOX_HOR_PADDING,
  RESITE_BOX_VERT_PADDING,
  RESITE_FONT_SIZE,
  LINE_PADDING_TOP,
  FONT_FAMILY
} from '../constants';

import {getAnnotationLayer} from '../rendering/annotations';
import {measureFontWidth} from '../rendering/fonts';

const getRestrictionSiteText = (site, textWidth, siteWidth, x, y) => {
  const yOffset = 3;

  return (
    <text
      x={x + (siteWidth / 2 - textWidth / 2)}
      y={y + yOffset}
      fontFamily={FONT_FAMILY}
      fontSize={RESITE_FONT_SIZE}
      fill={site.color}
      textAnchor="start">
      {site.name}
    </text>
  );
};

const getRestrictionSiteLine = (site, textWidth, siteWidth, index, config, startIndex, x, y) => {
  const firstLineEndX = x + (siteWidth/2 - textWidth/2) - 2;
  const secondLineStartX = x + (siteWidth/2 + textWidth/2) + 1;
  const secondLineEndX = x + siteWidth;
  return (
    <path
      d={'M ' + x.toString() + ' ' + y.toString() + ' ' + firstLineEndX + ' ' + y.toString() + ' ' +
         'M ' + secondLineStartX + ' ' + y.toString() + ' ' + secondLineEndX + ' ' + y.toString()}
      fill={site.color}
      stroke={site.color}
      strokeWidth="1"
    />
  );
};

const RestrictionSiteLabel = ({site, index, arr, config, startIndex, maxResiteLayer}) => {
  const layer = getAnnotationLayer(arr, index);
  const x = (site.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE + 1;
  const y = (maxResiteLayer - layer + 1) * (1 + RESITE_LABEL_GAP) + LINE_PADDING_TOP;
  const textWidth = site.name.length * measureFontWidth(FONT_FAMILY, RESITE_FONT_SIZE, 'i').width;
  const siteWidth = RESITE_BOX_HOR_PADDING + (site.endIndex - site.startIndex + 1) * config.LETTER_FULL_WIDTH_SEQUENCE;
  const siteText = getRestrictionSiteText(site, textWidth, siteWidth, x, y);
  const siteLine = getRestrictionSiteLine(site, textWidth, siteWidth, index, config, startIndex, x, y);
  const width = RESITE_BOX_HOR_PADDING + (site.endIndex - site.startIndex + 1) * config.LETTER_FULL_WIDTH_SEQUENCE;
  return (
    <g key={'resite-label'}>
      {siteText}
      {siteLine}
    </g>
  );
};

export default RestrictionSiteLabel;
