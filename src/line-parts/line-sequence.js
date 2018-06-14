import { charMap, MINUS_STRAND_MARGIN, LINE_PADDING_TOP } from '../constants';
import { flipSequence } from '../utils/sequence';
const Sequence = ({ sequence, config, minusStrand }) => {
  return <g>
      <text  y={ config.LETTER_HEIGHT_SEQUENCE + LINE_PADDING_TOP  } fontFamily="Inconsolata" fontSize="12pt" fill="#000000"
             letterSpacing={config.LETTER_SPACING_SEQUENCE}>{ sequence }</text>
      { minusStrand && <text x="0" y={ config.LETTER_HEIGHT_SEQUENCE*2 + MINUS_STRAND_MARGIN + LINE_PADDING_TOP  } fontFamily="Inconsolata"
                             fontSize="12pt" letterSpacing={config.LETTER_SPACING_SEQUENCE} fill="#808080" >
        { flipSequence(charMap, sequence) }</text> }
    </g>;
}

export default Sequence;