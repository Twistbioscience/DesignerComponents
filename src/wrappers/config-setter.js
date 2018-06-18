import React from 'react';
import {RIGHT_PADDING, SCOLL_BAR_OFFSET, FONT_FAMILY} from '../constants';
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
      const charsPerRow =
        Math.floor((width - RIGHT_PADDING) / (config.LETTER_WIDTH_SEQUENCE + config.LETTER_SPACING_SEQUENCE)) -
        SCOLL_BAR_OFFSET;
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
  const letterSpacing = 3;
  config.LETTER_WIDTH_SEQUENCE = oneLetter.width;
  config.LETTER_HEIGHT_SEQUENCE = oneLetter.height;
  config.LETTER_WIDTH_BP_INDEX_LABEL = measureFontWidth('Droid Sans Mono', '7pt').width;
  config.LETTER_SPACING_SEQUENCE = letterSpacing; // this could be calculated from letter width
  config.LETTER_FULL_WIDTH_SEQUENCE = 11;
  config.FIRST_LETTER_WIDTH = oneLetter.width;
  config.OTHER_LETTERS_WIDTH = twoLetters.width - oneLetter.width;
  config.BP_INDEX_HEIGHT = 25; //calculate dynamically
  return config;
};
