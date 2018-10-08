import React from 'react';
import {LEFT_PADDING, SCROLL_BAR_OFFSET, FONT_FAMILY} from '../constants';
import {measureFontWidth} from '../rendering/fonts';

export const WithConfigSetter = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.width !== this.props.width) {
        if (nextProps.width === 0) {
          this.setState({showDesigner: false});
        } else {
          this.calculateStaticParams(this.state.config, nextProps.width, nextProps.sequence);
        }
      }
    }

    componentWillMount() {
      const config = getConfig();
      this.setState({config: config});
      this.calculateStaticParams(config, this.props.width, this.props.sequence);
    }

    calculateStaticParams(config, width, sequence) {
      const charsPerRow = Math.floor((width - LEFT_PADDING) / config.LETTER_FULL_WIDTH_SEQUENCE) - SCROLL_BAR_OFFSET;
      const rowCount = Math.ceil(sequence.length / charsPerRow);
      this.setState({
        charsPerRow,
        rowCount,
        showDesigner: true
      });
    }

    render() {
      if (!this.state.showDesigner) {
        return <div> LOADING </div>;
      }
      return <Component {...this.props} {...this.state} />;
    }
  };
};

export const getConfig = () => {
  const config = {};
  const oneLetter = measureFontWidth(FONT_FAMILY, '12pt', 'G');
  const twoLetters = measureFontWidth(FONT_FAMILY, '12pt', 'GG');
  config.LETTER_WIDTH_SEQUENCE = oneLetter.width;
  config.LETTER_HEIGHT_SEQUENCE = oneLetter.height;
  config.LETTER_WIDTH_BP_INDEX_LABEL = measureFontWidth('Droid Sans Mono', '7pt').width;
  config.LETTER_FULL_WIDTH_SEQUENCE = twoLetters.width - oneLetter.width;
  config.SCROLL_BAR_OFFSET = SCROLL_BAR_OFFSET;
  // First letter has a different width from the others
  // So I kept these props for the dics - but I prefer not use them - cause they are just confusing
  // config.FIRST_LETTER_WIDTH = oneLetter.width;
  // config.OTHER_LETTERS_WIDTH = twoLetters.width - oneLetter.width;
  config.BP_INDEX_HEIGHT = 25; //calculate dynamically
  return config;
};
