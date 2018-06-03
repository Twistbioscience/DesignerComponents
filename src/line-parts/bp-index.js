import { LETTER_WIDTH, LETTER_HEIGHT } from '../constants';
import React from 'react';
import { measureFontWidth } from '../utils/rendering';

const LineBpIndex = ({startIndex, endIndex, stepSize, minusStrand, offset = 0}) => {
    const markers = [];
    const firstMarker = Math.ceil(startIndex/stepSize)*stepSize;
    const lastMarker = Math.floor(endIndex/stepSize)*stepSize;
    const offsetFromStart = firstMarker - startIndex;
    for (let marker = firstMarker; marker <= lastMarker; marker+= stepSize) {
        const pos = ((marker-startIndex+offset))*LETTER_WIDTH;
        const lineStart = !minusStrand ? LETTER_HEIGHT + 5 : 2 * LETTER_HEIGHT + 5;
        const lineEnd = !minusStrand ? LETTER_HEIGHT + 10 : 2 * LETTER_HEIGHT + 10;
        const bpLabel = !minusStrand ? LETTER_HEIGHT + 20 : 2 * LETTER_HEIGHT + 20;
        const markerWidth = measureFontWidth('monospace', '10px', marker);
        markers.push(<line key={`bp-line-${marker}`} x1={ pos + LETTER_WIDTH/2 } x2={ pos + LETTER_WIDTH/2 } y1={ lineStart } y2={ lineEnd } shapeRendering="crispEdges" stroke="#000000" strokeWidth="1px"/>)
        markers.push(<text key={`bp-index-marker-${marker}`} fontFamily="monospace" className="indecies" fontSize="10px" fill="#4A4A4A" y={ bpLabel } x={ pos }>{ marker }</text>);
    }
    return <g height={ 20 }>{ markers }</g>;
}  

export default LineBpIndex;  