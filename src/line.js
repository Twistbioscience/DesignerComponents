import React from 'react';
import {
  LETTER_WIDTH,
  LETTER_HEIGHT,
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  SCOLL_BAR_OFFSET,
  charMap
} from './constants';
import { flipSequence } from './utils/sequence';
import { getAnnotationLayer } from './utils/rendering';
import LineBpIndex from './line-parts/bp-index';



class Line extends React.Component {
  render() {
    const { gene, charsPerRow , showMinusStrand, index, style } = this.props;
    const startIndex = charsPerRow*index;
    const sequence = gene.text.substr(startIndex, charsPerRow).toUpperCase();
    const annotations = gene.annotations
    .filter(
      annotation => (annotation.startIndex < startIndex && annotation.endIndex > startIndex) || (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
    )
    .map((annotation, index, arr) => {
        const layer = getAnnotationLayer(arr,index);
        const width = (annotation.endIndex - annotation.startIndex) * LETTER_WIDTH;
        const x = (annotation.startIndex - startIndex ) * LETTER_WIDTH;
        const y = (LETTER_HEIGHT * (showMinusStrand ? 2 : 1)) + (layer * (ANNOTATION_HEIGHT + ANNOTATION_GAP));
        return <g>
          <rect width={ width } x={ x } y={ y }
            height={ ANNOTATION_HEIGHT } fill="#0000a4" fillOpacity="0.3"/>
          <text x={ x + width/4 } y={ y + (ANNOTATION_HEIGHT/2) + 6 } fontSize="12" className="indecies">{ annotation.name }</text>
        </g>  
    })

    return (
      <svg style={style} width={LETTER_WIDTH*charsPerRow} fontFamily="monospace" fontSize="12pt">
        <text x="0" y={ LETTER_HEIGHT  }>{ sequence }</text>
        <LineBpIndex startIndex={ startIndex + 1 } endIndex={ startIndex + sequence.length + 1 } stepSize={ 10 }/>
        { showMinusStrand && <text x="0" y={ LETTER_HEIGHT*2  }>{ flipSequence(charMap, sequence) }</text> }
        { annotations }
      </svg>
    );
  }
} 

export default Line;


