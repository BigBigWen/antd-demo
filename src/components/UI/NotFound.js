import React from 'react';
import './NotFound.less';

const NotFound = ({ text = '暂无数据' }) => (
  <div className="c-not-found">
    <div className="img" />
    <div className="text">{text}</div>
  </div>
);

export default NotFound;
