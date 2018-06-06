import { LINE_PADDING_TOP } from '../constants';


const Selection = ({ selectionRect, height, selection, startIndex, endIndex }) => {
  return <g>
    <rect x={selectionRect.x} y={LINE_PADDING_TOP}
          height={height} width={selectionRect.wdt}
          fill= "rgba(0,0,0,0.05)" />}
    {(selection.startIndex > startIndex && selection.startIndex< endIndex) && <SelectionCaret height={height} pos={selectionRect.x} />}
    {(selection.endIndex < endIndex && selection.endIndex >  startIndex) && <SelectionCaret height={height} pos={selectionRect.x + selectionRect.wdt} />}
  </g>;
};

const SelectionCaret = ({height , pos}) => {
  return <g>
    <rect x= {pos-3} height="4" width="4" fill="0x111111" />
    <line  x1={ pos-1 } x2={ pos-1 }
               y1={ 0  } y2={ height } shapeRendering="crispEdges" stroke="#000000"
               strokeWidth="2px"/>
  </g>
};


export default Selection;