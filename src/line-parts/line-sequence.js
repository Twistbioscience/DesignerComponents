import { charMap } from '../constants';
import { flipSequence } from '../utils/sequence';

const Sequence = ({startIndex, endIndex, sequence, selection, config, minusStrand }) => {
  const selectionPaddingButtom = 5;
  const selectionHeight = minusStrand ? config.LETTER_HEIGHT_12_PX*2 + selectionPaddingButtom  :
    config.LETTER_HEIGHT_12_PX + selectionPaddingButtom;
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
      <text  y={ config.LETTER_HEIGHT_12_PX  } fontFamily="Inconsolata" fontSize="12pt" letterSpacing="2">{ sequence }</text>
      { minusStrand && <text x="0" y={ config.LETTER_HEIGHT_12_PX*2  } fontFamily="Inconsolata" fontSize="12pt" letterSpacing="2" >
        { flipSequence(charMap, sequence) }</text> }
      {(selectionRect.wdt > 0) && <rect x={selectionRect.x}
                                        height={selectionHeight} width={selectionRect.wdt}
                                        fill= "rgba(1,1,1,0.2)" />}
    </g>;
}

export default Sequence;