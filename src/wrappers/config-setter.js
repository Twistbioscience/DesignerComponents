import React from 'react';
import {
  RIGHT_PADDING,
  SCOLL_BAR_OFFSET
} from '../constants';
import { measureFontWidth } from '../rendering/fonts';

export const WithConfigSetter = (Component) => {
  return class extends React.Component{

    constructor(props) {
      super(props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.width !== this.props.width) {
        if (nextProps.width === 0) {
          this.setState({ showDesigner: false });
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
      const charsPerRow = Math.floor((width-RIGHT_PADDING)/(config.LETTER_WIDTH_SEQUENCE + config.LETTER_SPACING_SEQUENCE)) - SCOLL_BAR_OFFSET;
      const rowCount = Math.ceil(sequence.length/charsPerRow);
      this.setState({
        charsPerRow,
        rowCount,
        showDesigner: true
      });
    }

    render() {
      if (!this.state.showDesigner) {
        return <div> LOADING </div>
      }
      return <Component {...this.props} {...this.state}  />
    }

  };
};


export const getConfig = () => {
  const config = {};
  const fontSize = measureFontWidth('Inconsolata', '12pt');
  const letterSpacing = 3;
  config.LETTER_WIDTH_SEQUENCE = fontSize.width;
  config.LETTER_HEIGHT_SEQUENCE = fontSize.height;
  config.LETTER_WIDTH_BP_INDEX_LABEL = measureFontWidth('Droid Sans Mono', '7pt').width;
  config.LETTER_SPACING_SEQUENCE = letterSpacing; // this could be calculated from letter width
  config.LETTER_FULL_WIDTH_SEQUENCE = (fontSize.width + letterSpacing);
  config.BP_INDEX_HEIGHT = 25;   //calculate dynamically
  return config;
};

