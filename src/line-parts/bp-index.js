import React from 'react';

const LineBpIndex = ({startIndex, endIndex, stepSize, minusStrand, offset = 0, config}) => {
    const markers = [];
    const firstMarker = Math.ceil(startIndex/stepSize)*stepSize;
    const lastMarker = Math.floor(endIndex/stepSize)*stepSize;
    for (let marker = firstMarker; marker <= lastMarker; marker+= stepSize) {
        const pos = ((marker-startIndex+offset))*config.LETTER_WIDTH_12_PX;
        const lineStart = !minusStrand ? config.LETTER_HEIGHT_12_PX + 5 : 2 * config.LETTER_HEIGHT_12_PX + 5;
        const lineEnd = !minusStrand ? config.LETTER_HEIGHT_12_PX + 10 : 2 * config.LETTER_HEIGHT_12_PX + 10;
        const bpLabel = !minusStrand ? config.LETTER_HEIGHT_12_PX + 20 : 2 * config.LETTER_HEIGHT_12_PX + 20;
        markers.push(<line key={`bp-line-${marker}`} x1={ pos + config.LETTER_WIDTH_12_PX/2 } x2={ pos + config.LETTER_WIDTH_12_PX/2 }
                           y1={ lineStart } y2={ lineEnd } shapeRendering="crispEdges" stroke="#000000"
                           strokeWidth="1px"/>)
        markers.push(<text key={`bp-index-marker-${marker}`} fontFamily="monospace"  fontSize="10px" fill="#4A4A4A"
                           y={ bpLabel } x={ pos }>{ marker }</text>);
    }
    return <g height={ 20 }>{ markers }</g>;
}  

export default LineBpIndex;  