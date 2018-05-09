import React, { Component } from 'react';

const scrollToTop = ({ top, ...rest }) => WrappedComponent =>
  class ScrollTopComponent extends Component {
    constructor(props) {
      super(props);
    }

    componentDidUpdate(prevProps) {
      document.body.scrollTop = top || 0;
      // window.scrollTo(0, 0);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export default scrollToTop;
