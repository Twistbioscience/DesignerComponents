import React from 'react';
import {
  LETTER_HEIGHT,
  ANNOTATION_HEIGHT,
  ANNOTATION_GAP
} from './constants';
import { getAnnotationLayer } from './utils/rendering';
import LineBpIndex from './line-parts/bp-index';
import Sequence from './line-parts/line-sequence';



class Line extends React.Component {

  constructor(){
    super();
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }

  mouseDownHandler(index, charsPerRow){

    return (e) => {
      this.props.onMouseDown(e, index * charsPerRow);
    }
  }
  mouseUpHandler(index, charsPerRow, endSelection, selectionInProgress){

    return (e) => {
      console.log(this.props.selectionInProgress)
      if(selectionInProgress) {
        this.props.onMouseUp(e, index * charsPerRow, endSelection);
      }

    }
  }

  render() {
    const { charsPerRow , minusStrand, index, style, selection, selectionInProgress, config } = this.props;
    const startIndex = charsPerRow*index;
    const sequence = this.props.sequence.substr(startIndex, charsPerRow).toUpperCase();
    const annotations = this.props.annotations
    .filter(
      annotation => (annotation.startIndex < startIndex && annotation.endIndex > startIndex) || (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
    )
    .map((annotation, index, arr) => {
        const layer = getAnnotationLayer(arr,index);
        const width = (annotation.endIndex - annotation.startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
        const x = (annotation.startIndex - startIndex ) * config.LETTER_FULL_WIDTH_SEQUENCE;
        const y = (config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1)) + (layer * (ANNOTATION_HEIGHT + ANNOTATION_GAP));
        const points = [
                //arrowheads on both edges, no teeth:
                x - 5/2, y,
                x + width - 5/2, y,
                x + width + 5/2, y+ANNOTATION_HEIGHT/2,
                x + width - 5/2, y+ANNOTATION_HEIGHT,
                x - 5/2, y+ANNOTATION_HEIGHT,
                x + 5/2, y+ANNOTATION_HEIGHT/2
            ].join(' ');
        return <g>
          <polygon points={ points } x={ x } y={ y } fill={ annotation.color || "#0000a4" } fillOpacity="0.3"/>
          <text x={ x + width/4 } y={ y + (ANNOTATION_HEIGHT/2) + 5 } fontSize="12px" className="indecies">{ annotation.name }</text>
        </g>  
    })

    return (
      <svg style={style} width={config.LETTER_FULL_WIDTH_SEQUENCE*charsPerRow}
    onMouseDown={ this.mouseDownHandler(index, charsPerRow)}
    onMouseUp={ this.mouseUpHandler(index, charsPerRow, true, selectionInProgress)}
    onMouseMove={ this.mouseUpHandler(index, charsPerRow, false, selectionInProgress)}  >
        <Sequence startIndex={ startIndex + 1 } endIndex={ startIndex + sequence.length + 1 } sequence={sequence}
                  minusStrand={ minusStrand } selection={selection} config={config} />
        <LineBpIndex startIndex={ startIndex + 1 } endIndex={ startIndex + sequence.length  } stepSize={ 10 }
                     minusStrand={ minusStrand } offset={ startIndex === 1 ? 30 : 0} config={config} />
        { annotations }
      </svg>
    );
  }
} 

export default Line;


