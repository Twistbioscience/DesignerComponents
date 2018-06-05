import { charMap, MINUS_STRAND_MARGIN, LINE_PADDING_TOP } from '../constants';
import { flipSequence } from '../utils/sequence';
const Sequence = ({startIndex, endIndex, sequence, selection, config, minusStrand }) => {
  const selectionPaddingButtom = 5;
  const selectionHeight = minusStrand ? config.LETTER_HEIGHT_SEQUENCE*2 + MINUS_STRAND_MARGIN + selectionPaddingButtom  :
    config.LETTER_HEIGHT_SEQUENCE + selectionPaddingButtom;
  const getRect = () => {
    const startX = (selection.startIndex && selection.startIndex > startIndex) ? (selection.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE : 0 ;
    const endX = selection.endIndex ?
      (selection.endIndex < endIndex) ? (selection.endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE :
        (endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE :
        -1;
    return {x:startX, wdt:endX - startX};
  };

  const selectionRect = getRect();
  return <g>
      <text  y={ config.LETTER_HEIGHT_SEQUENCE + LINE_PADDING_TOP  } fontFamily="Inconsolata" fontSize="12pt" fill="#000000"
             letterSpacing={config.LETTER_SPACING_SEQUENCE}>{ sequence }</text>
      { minusStrand && <text x="0" y={ config.LETTER_HEIGHT_SEQUENCE*2 + MINUS_STRAND_MARGIN + LINE_PADDING_TOP  } fontFamily="Inconsolata"
                             fontSize="12pt" letterSpacing={config.LETTER_SPACING_SEQUENCE} fill="#808080" >
        { flipSequence(charMap, sequence) }</text> }
      {(selectionRect.wdt > 0) && <rect x={selectionRect.x} y={LINE_PADDING_TOP}
                                        height={selectionHeight} width={selectionRect.wdt}
                                        fill= "rgba(0,0,0,0.05)" />}
    </g>;
}

export default Sequence;