import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import history from 'lib/history';
import bowser from 'bowser';
import NotSupport from 'components/UI/NotSupport';
import App from './App';
import store from 'store/index';
import 'moment/locale/zh-cn';
import './index.less';
import './theme/maxtropy.less';

const supportEngine = ['webkit', 'gecko', 'blink', 'msedge'];
const checkBrowser = () => {
  if (!supportEngine.some(p => bowser[p])) {
    let elm = document.createElement('div');
    elm.innerHTML = NotSupport;
    document.body.appendChild(elm);
  }
};

checkBrowser();

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <App history={history} />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
);
