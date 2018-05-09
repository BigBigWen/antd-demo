import React from 'react';
import './Loading.less';

const Loading = ({ loading, text }) =>
  loading ? (
    <div className="issueLoading">
      <div className="loadingContainer">
        <div className="wBall" id="wBall_1">
          <div className="wInnerBall" />
        </div>
        <div className="wBall" id="wBall_2">
          <div className="wInnerBall" />
        </div>
        <div className="wBall" id="wBall_3">
          <div className="wInnerBall" />
        </div>
        <div className="wBall" id="wBall_4">
          <div className="wInnerBall" />
        </div>
        <div className="wBall" id="wBall_5">
          <div className="wInnerBall" />
        </div>
        <div className="loadingText">
          <p>{text}</p>
          <p>请耐心等待</p>
        </div>
      </div>
    </div>
  ) : null;

export default Loading;
