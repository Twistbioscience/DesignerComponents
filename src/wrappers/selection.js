import React from 'react';
import {
  RIGHT_PADDING,
  SCOLL_BAR_OFFSET
} from '../constants';
import { measureFontWidth } from '../utils/rendering';
import FontsLoader from '../utils/fonts-loader';

const config = {
  LETTER_WIDTH_SEQUENCE:0,
  LETTER_HEIGHT_SEQUENCE:0,
  LETTER_WIDTH_BP_INDEX_LABEL:0,
  LETTER_SPACING_SEQUENCE:0,
  LETTER_FULL_WIDTH_SEQUENCE:0,
  BP_INDEX_HEIGHT:0,
};

export const WithSelection = (Component) => {
  return class extends React.Component{
    constructor(props) {
      super(props);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onFontsLoaded = this.onFontsLoaded.bind(this);
      this.state = {
        clickedIndex: null,
        selection:{},
        mouseDownIndex: 0,
      };
    }

    getIndexFromEvent(e, index) {
      return Math.floor((e.clientX-RIGHT_PADDING)/(config.LETTER_WIDTH_SEQUENCE + config.LETTER_SPACING_SEQUENCE)) + index;
    }

    onMouseDown(e, index){
      this.setState({ mouseDownIndex: this.getIndexFromEvent(e, index) });
    }

    onMouseUp(e, index, endSelection){
      const mouseUpIndex = this.getIndexFromEvent(e, index);
      const selection = {startIndex: Math.min(this.state.mouseDownIndex, mouseUpIndex), endIndex: Math.max(this.state.mouseDownIndex, mouseUpIndex)  };
      this.setState({ selection: selection});
      if(endSelection){
        this.setState({ mouseDownIndex: 0});
      }
    }

    render() {
      if (!this.state.showDesigner || !this.state.fontsLoaded) {
        return <FontsLoader callBack={this.onFontsLoaded} />
      }
      return <Component {...this.props} {...this.state} config={config} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
    }


    componentWillReceiveProps(nextProps) {
      if (nextProps.width !== this.props.width) {
        if (nextProps.width === 0) {
          this.setState({ showDesigner: false });
        } else {
          this.calculateStaticParams(nextProps);
        }
      }
    }

    onFontsLoaded() {
      this.setState({fontsLoaded:true});
      const fontSize = measureFontWidth('Inconsolata', '12pt');
      const letterSpacing = 3;
      config.LETTER_WIDTH_SEQUENCE = fontSize.width;
      config.LETTER_HEIGHT_SEQUENCE = fontSize.height;
      config.LETTER_WIDTH_BP_INDEX_LABEL = measureFontWidth('Droid Sans Mono', '7pt').width;
      config.LETTER_SPACING_SEQUENCE = letterSpacing; // this could be calculated from letter width
      config.LETTER_FULL_WIDTH_SEQUENCE = (fontSize.width + letterSpacing);
      config.BP_INDEX_HEIGHT = 25;   //calculate dynamically
      this.calculateStaticParams(this.props);
    }

    calculateStaticParams(props) {
      const charsPerRow = Math.floor((props.width-RIGHT_PADDING)/(config.LETTER_WIDTH_SEQUENCE + config.LETTER_SPACING_SEQUENCE)) - SCOLL_BAR_OFFSET;
      const rowCount = Math.ceil(props.sequence.length/charsPerRow);
      this.setState({
        charsPerRow,
        rowCount,
        showDesigner: true
      });
    }

  };
};
