import React from 'react';
import PropTypes from 'prop-types';
import './NotFound.less';

const NotFound = ({ text, height }) => (
  <div className="c-not-found" style={{ height: height || '100%' }}>
    <div className="not-found-container">
      <div className="img" />
      <div className="text">{text}</div>
    </div>
  </div>
);

export default NotFound;
