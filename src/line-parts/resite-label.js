// @flow
import React from 'react';
import {RESITE_LABEL_GAP, RESITE_BOX_HOR_PADDING, RESITE_FONT_SIZE, LINE_PADDING_TOP, FONT_FAMILY} from '../constants';
import {measureFontWidth} from '../rendering/fonts';
import type {RestrictionSite, Config} from '../types';

const RestrictionSiteLabel = ({
  site,
  layerIndex,
  config,
  startIndex,
  maxResiteLayer,
  charsPerRow,
  lineWidth,
  onClick
}: {
  site: RestrictionSite,
  layerIndex: number,
  config: Config,
  startIndex: number,
  maxResiteLayer: number,
  charsPerRow: number,
  lineWidth: number,
  onClick: any
}) => {
  const x = (site.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE + 1;
  const y = (maxResiteLayer - layerIndex) * (1 + RESITE_LABEL_GAP) + LINE_PADDING_TOP;
  const textWidth = site.name.length * measureFontWidth(FONT_FAMILY, RESITE_FONT_SIZE, 'i').width;
  const siteWidth = RESITE_BOX_HOR_PADDING + (site.endIndex - site.startIndex + 1) * config.LETTER_FULL_WIDTH_SEQUENCE;
  var translate = 'translate(0)';
  var d = null;
  var isTextShown = true;
  var showLine = true;
  var showText = true;
  const isSiteCroppedFromLeft = site.startIndex < startIndex;
  const isSiteCroppedFromRight = site.endIndex - startIndex + 1 > charsPerRow;

  if (isSiteCroppedFromLeft) {
    isTextShown = x + siteWidth / 2 + textWidth / 2 > 0;
    if (isTextShown) {
      // if text is cropped from left
      if (x + siteWidth / 2 - textWidth / 2 < 0) {
        // if more of the text is showing on this line, move the text to the right
        if (x + siteWidth / 2 > 0) {
          translate = 'translate(' + (-x - siteWidth / 2 + textWidth / 2) + ')';
          //  if text wider then remaining site width, don't show line
          if (x + siteWidth < textWidth) {
            showLine = false;
          } else {
            // draw a tail on right side
            d = 'M ' + (textWidth + 1) + ' ' + y + ' ' + (x + siteWidth) + ' ' + y;
          }
        }
        // if more of the text is showing on the previous line, we will render the text there instead
        // here we will just draw a line from the start to the end
        else {
          showText = false;
          d = 'M 0 ' + y + ' ' + (x + siteWidth) + ' ' + y;
        }
      }
    }
  } else if (isSiteCroppedFromRight) {
    isTextShown = x + siteWidth / 2 - textWidth / 2 < lineWidth;
    if (isTextShown) {
      // if text is cropped from right
      if (x + siteWidth / 2 + textWidth / 2 > lineWidth) {
        // if half or more of the text is showing on this line, move the text to the left
        if (x + siteWidth / 2 <= lineWidth) {
          translate = 'translate(' + (-x - siteWidth / 2 - textWidth / 2 + lineWidth) + ')';
          //  if text wider then remaining site width, don't show line
          if (lineWidth - textWidth < x) {
            showLine = false;
          } else {
            // draw a tail on left side
            d = 'M ' + x + ' ' + y + ' ' + (lineWidth - textWidth - 1) + ' ' + y;
          }
        }
        // if more of the text is showing on the following line, we will render the text there instead
        // here we will just draw a line from the start to the end
        else {
          showText = false;
          d = 'M ' + x + ' ' + y + ' ' + lineWidth + ' ' + y;
        }
      }
    }
  }

  const siteText = getRestrictionSiteText(site, textWidth, siteWidth, x, y, translate);
  const siteLine = getRestrictionSiteLine(site, textWidth, siteWidth, config, startIndex, x, y, d);
  return (
    <g key={'resite-label'}>
      {showText && siteText}
      {showLine && siteLine}
      <rect width={siteWidth} onClick={onClick} x={x} y={y - 6} height={11} opacity="0" fill="#FFFFFF" />
    </g>
  );
};

const getRestrictionSiteText = (site, textWidth, siteWidth, x, y, translate) => {
  const yOffset = 3;

  return (
    <text
      x={x + (siteWidth / 2 - textWidth / 2)}
      y={y + yOffset}
      transform={translate}
      fontFamily={FONT_FAMILY}
      fontSize={RESITE_FONT_SIZE}
      fill={site.color || '#0000a4'}
      textAnchor="start">
      {site.name}
    </text>
  );
};

// If d is passed in, it is because the text was cropped and we are changing the location of the text/line
const getRestrictionSiteLine = (site, textWidth, siteWidth, config, startIndex, x, y, d) => {
  const firstLineEndX = Math.max(x, x + (siteWidth / 2 - textWidth / 2) - 2);
  const secondLineStartX = x + (siteWidth / 2 + textWidth / 2) + 1;
  const secondLineEndX = Math.max(secondLineStartX, x + siteWidth);
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
      fill={site.color || '#0000a4'}
      stroke={site.color}
      strokeWidth="1"
    />
  );
};

export default RestrictionSiteLabel;
