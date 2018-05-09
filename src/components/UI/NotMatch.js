import React from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router';
import notAuthorizePic from './imgs/notAuthorized.png';
import notExistPic from './imgs/notExist.png';
import './NotMatch.less';

const PICS = {
  403: notAuthorizePic,
  404: notExistPic
};

const TEXT = {
  403: '抱歉，您无权访问该页面',
  404: '抱歉，您访问的页面不存在'
};

const NotMatch = props => {
  const { code, history } = props;
  return (
    <div className="c-not-match">
      <div className="not-match-container">
        <img alt="errorPage" src={PICS[code]} />
        <div className="not-match-info">
          <h3>{code}</h3>
          <p>{TEXT[code]}</p>
          <Button type="primary" onClick={() => history.push('/')}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(NotMatch);
