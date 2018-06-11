import React from 'react';
import WebFont from 'webfontloader';

export const WithFontsLoader = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        fontsLoaded: false
      };
    }

    render() {
      if (!this.state.fontsLoaded) {
        return <div> LOADING </div>;
      }
      return <Component {...this.props} {...this.state} />;
    }

    componentDidMount() {
      const onFontsLoaded = () => {
        this.setState({fontsLoaded: true});
      };

      WebFont.load({
        google: {
          families: ['Inconsolata', 'Droid Sans Mono']
        },
        active: function() {
          onFontsLoaded();
        }
      });
    }
  };
};
