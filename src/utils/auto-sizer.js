import React, {Component} from 'react';

class AutoSizer extends Component {
  render() {
    return <div ref={this.ref}>{this.props.children({width: this.state.width, x: this.state.x})}</div>;
  }

  constructor(props) {
    super(props);
    this.ref = this.ref.bind(this);
    this.onResize = this.onResize.bind(this);
    this.state = {
      x: null,
      width: null
    };
  }

  componentDidMount() {
    if (this.autoSizer) {
      window.addEventListener('resize', this.onResize);
      this.onResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    if (this.autoSizer) {
      const {x, width} = this.autoSizer.getBoundingClientRect();
      this.setState({x, width});
    }
  }

  ref(c) {
    this.autoSizer = c;
  }
}

export default AutoSizer;
