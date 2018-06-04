import { LETTER_WIDTH, LETTER_HEIGHT } from '../constants';

const Sequence = ({startIndex, endIndex, sequence, selection }) => {

  const getRect = () => {

    const startX = (selection.startIndex && selection.startIndex > startIndex) ? (selection.startIndex - startIndex) * LETTER_WIDTH : 0 ;
    const endX = selection.endIndex ?
      (selection.endIndex < endIndex) ? (selection.endIndex - startIndex) * LETTER_WIDTH : (endIndex - startIndex) * LETTER_WIDTH :
      -1;
    console.log("***",startX)

    return {x:startX, wdt:endX - startX};
  };

  const selectionRect = getRect();
  return <g>
      <text  y={ LETTER_HEIGHT  } fontFamily="Inconsolata" fontSize="12pt" letterSpacing="2" style={{fontFamily: "Inconsolata"}} >{ sequence }</text>
      {selectionRect.wdt > 0 && <rect x={selectionRect.x} y="10" height={LETTER_HEIGHT} width={selectionRect.wdt} fill= "rgba(1,1,1,0.2)" />}

    </g>;
}

export default Sequence;