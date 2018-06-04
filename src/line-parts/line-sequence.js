import { LETTER_HEIGHT } from '../constants';

const Sequence = ({startIndex, endIndex, sequence, selection, config }) => {

  const getRect = () => {
    const startX = (selection.startIndex && selection.startIndex > startIndex) ? (selection.startIndex - startIndex) * config.LETTER_WIDTH_12_PX : 0 ;
    const endX = selection.endIndex ?
      (selection.endIndex < endIndex) ? (selection.endIndex - startIndex) * config.LETTER_WIDTH_12_PX :
        (endIndex - startIndex) * config.LETTER_WIDTH_12_PX :
        -1;
    return {x:startX, wdt:endX - startX};
  };

  const selectionRect = getRect();
  return <g>
      <text  y={ LETTER_HEIGHT  } fontFamily="Inconsolata" fontSize="12pt" letterSpacing="2">{ sequence }</text>
      {(selectionRect.wdt > 0) && <rect x={selectionRect.x} y="10" height={LETTER_HEIGHT} width={selectionRect.wdt} fill= "rgba(1,1,1,0.2)" />}
    </g>;
}

export default Sequence;