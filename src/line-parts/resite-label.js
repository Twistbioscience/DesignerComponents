import {RESITE_LABEL_GAP, RESITE_BOX_HOR_PADDING, RESITE_FONT_SIZE, LINE_PADDING_TOP, FONT_FAMILY} from '../constants';

import {getAnnotationLayer} from '../rendering/annotations';
import {measureFontWidth} from '../rendering/fonts';

const getRestrictionSiteText = (site, textWidth, siteWidth, x, y, translate) => {
  const yOffset = 3;

  return (
    <text
      x={x + (siteWidth / 2 - textWidth / 2)}
      y={y + yOffset}
      transform={translate}
      fontFamily={FONT_FAMILY}
      fontSize={RESITE_FONT_SIZE}
      fill={site.color}
      textAnchor="start">
      {site.name}
    </text>
  );
};

const getRestrictionSiteLine = (site, textWidth, siteWidth, index, config, startIndex, x, y, d) => {
  const firstLineEndX = x + (siteWidth / 2 - textWidth / 2) - 2;
  const secondLineStartX = x + (siteWidth / 2 + textWidth / 2) + 1;
  const secondLineEndX = x + siteWidth;
  return (
    <path
      d={
        d ||
        'M ' +
          x +
          ' ' +
          y +
          ' ' +
          firstLineEndX +
          ' ' +
          y +
          ' ' +
          'M ' +
          secondLineStartX +
          ' ' +
          y +
          ' ' +
          secondLineEndX +
          ' ' +
          y
      }
      fill={site.color}
      stroke={site.color}
      strokeWidth="1"
    />
  );
};

const RestrictionSiteLabel = ({site, index, arr, config, startIndex, maxResiteLayer, charsPerRow}) => {
  const layer = getAnnotationLayer(arr, index);
  const x = (site.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE + 1;
  const y = (maxResiteLayer - layer + 1) * (1 + RESITE_LABEL_GAP) + LINE_PADDING_TOP;
  const textWidth = site.name.length * measureFontWidth(FONT_FAMILY, RESITE_FONT_SIZE, 'i').width;
  const siteWidth = RESITE_BOX_HOR_PADDING + (site.endIndex - site.startIndex + 1) * config.LETTER_FULL_WIDTH_SEQUENCE;
  var translate = 'translate(0)';
  var d = null;
  var isTextShown = true;
  var isLineShown = true;
  var textAdjusted = false;
  const isSiteCroppedFromLeft = site.startIndex < startIndex;
  const isSiteCroppedFromRight = site.endIndex - startIndex + 1 > charsPerRow;

  if (isSiteCroppedFromLeft) {
    isTextShown = x + siteWidth / 2 + textWidth / 2 > 0;
    if (isTextShown) {
      // if text is cropped by left edge of container, move it to the right
      if (x + siteWidth / 2 - textWidth / 2 < 0) {
        translate = 'translate(' + (-x - siteWidth / 2 + textWidth / 2) + ')';
        //  if text wider then remaining site width, don't show line
        if (x + siteWidth < textWidth) {
          isLineShown = false;
        } else {
          // draw a tail on right side
          d = 'M ' + (textWidth + 1) + ' ' + y + ' ' + (x + siteWidth) + ' ' + y;
        }
        textAdjusted = true;
      }
    }
  } else if (isSiteCroppedFromRight) {
    const lineWidth = config.LETTER_FULL_WIDTH_SEQUENCE * charsPerRow;
    isTextShown = x + siteWidth / 2 - textWidth / 2 < lineWidth;
    if (isTextShown) {
      // if text is cropped by right edges, move it to the left
      if (x + siteWidth / 2 + textWidth / 2 > lineWidth) {
        translate = 'translate(' + (-x - siteWidth / 2 - textWidth / 2 + lineWidth) + ')';
        //  if text wider then remaining site width, don't show line
        if (lineWidth - textWidth < x) {
          isLineShown = false;
        } else {
          // draw a tail on right side
          d = 'M ' + x + ' ' + y + ' ' + (lineWidth - textWidth - 1) + ' ' + y;
        }
      }
    }
  }

  const siteText = getRestrictionSiteText(site, textWidth, siteWidth, x, y, translate);
  const siteLine = getRestrictionSiteLine(site, textWidth, siteWidth, index, config, startIndex, x, y, d);
  return (
    <g key={'resite-label'}>
      {siteText}
      {isLineShown && siteLine}
    </g>
  );
};

export default RestrictionSiteLabel;
