import React from 'react';
import {
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP,
  LINE_PADDING_TOP,
  MINUS_STRAND_MARGIN,
  ANNOTATION_PADDING_TOP
} from '../constants';
import { getAnnotationLayer } from '../rendering/annotations';
import LineBpIndex from './bp-index';
import Sequence from './line-sequence';
import Selection from './selection';



class Line extends React.Component {

  constructor(){
    super();
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }

  mouseDownHandler(index, charsPerRow){
    return this.props.onMouseDown ? (e) => {
      this.props.onMouseDown(e, index * charsPerRow);
    } : null;
  }
  mouseUpHandler(index, charsPerRow, endSelection, selectionInProgress){

    return this.props.onMouseUp ? (e) => {
      if(selectionInProgress) {
        this.props.onMouseUp(e, index * charsPerRow, endSelection);
      }
    } : null;
  }

  render() {
    const { charsPerRow , minusStrand, index, style, selection, selectionInProgress, config } = this.props;
    const startIndex = charsPerRow*index;
    const sequence = this.props.sequence.substr(startIndex, charsPerRow).toUpperCase();
    const endIndex = startIndex + sequence.length;
    const annotationsBottom = this.props.annotations
      .filter(
        annotation => (annotation.startIndex < startIndex && annotation.endIndex > startIndex) || (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
      )
      .map((annotation, index, arr) => {
        const layer = getAnnotationLayer(arr,index);
        const width = (annotation.endIndex - annotation.startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
        const x = (annotation.startIndex - startIndex ) * config.LETTER_FULL_WIDTH_SEQUENCE;
        const y = (config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1)) + (minusStrand ? MINUS_STRAND_MARGIN : 0) +
          (layer * (ANNOTATION_HEIGHT + ANNOTATION_GAP)) + LINE_PADDING_TOP + ANNOTATION_PADDING_TOP;
        const points = [
          //arrowheads on both edges, no teeth:
          x - 5/2, y,
          x + width - 5/2, y,
          x + width + 5/2, y+ANNOTATION_HEIGHT/2,
          x + width - 5/2, y+ANNOTATION_HEIGHT,
          x - 5/2, y+ANNOTATION_HEIGHT,
          x + 5/2, y+ANNOTATION_HEIGHT/2
        ].join(' ');
        return <g key={`annotations-bottom-${index}`}>
          <polygon key={`annotations-bottom-poly-${index}`} points={ points } x={ x } y={ y } fill={ annotation.color || "#0000a4" } fillOpacity="0.3"/>
          <text key={`annotations-bottom-text-${index}`} x={ x + width/4 } y={ y + (ANNOTATION_HEIGHT/2) + 5 } fontSize="12px">{ annotation.name }</text>
        </g>
      })

    const getRect = () => {
      const startX = (selection.startIndex && selection.startIndex > startIndex) ? (selection.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE : 0 ;
      const endX = selection.endIndex ?
        (selection.endIndex < endIndex) ? (selection.endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE :
          (endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE :
        -1;
      return {x:startX, wdt:endX - startX};
    };

    const selectionRect = selection ? getRect() : 0;
    return (
      <svg style={style} width={config.LETTER_FULL_WIDTH_SEQUENCE*charsPerRow}
           onMouseDown={ this.mouseDownHandler(index, charsPerRow)}
           onMouseUp={ this.mouseUpHandler(index, charsPerRow, true, selectionInProgress)}
           onMouseMove={ this.mouseUpHandler(index, charsPerRow, false, selectionInProgress)}  >
        <Sequence sequence={sequence} minusStrand={ minusStrand } config={config} />
        <LineBpIndex startIndex={ startIndex + 1 } endIndex={ startIndex + sequence.length  } stepSize={ 10 }
                     minusStrand={ minusStrand } offset={ startIndex === 1 ? 30 : 0} config={config} />
        { annotationsBottom }
        <rect height="2" y={style.height-2} width={config.LETTER_FULL_WIDTH_SEQUENCE*charsPerRow} style={{fill: "#000000"}}/>
        {(selectionRect.wdt > 0) && <Selection height={style.height} selectionRect={selectionRect}
                                               selection={selection} startIndex={startIndex} endIndex={endIndex} />}
      </svg>
    );
  }
}

export default Line;

