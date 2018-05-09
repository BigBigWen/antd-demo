import download from 'downloadjs';
import store from '../store/index';
import { LOGOUT } from 'constants/actionTypes';
import history from 'lib/history';
import { Modal } from 'antd';

/**
 * Global wrapper for fetch
 * @param {string} url - the url to request
 * @param {object} options - initial variable for request
 */

import { isNil, pickBy } from 'lodash';
import * as qs from 'qs';

const refresh = () => {
  Modal.error({
    title: '该页面信息已更新，页面将在3秒后更新',
    onOk() {
      window.location.reload();
    },
    okText: '立即更新'
  });
  setTimeout(() => window.location.reload(), 3000);
};

function GetError(code, message) {
  this.code = code;
  this.message = message;
}

function processJson(json) {
  if (json.code) {
    throw new GetError(json.code, json.message);
  } else {
    return json;
  }
}

function processRes(res) {
  if (`${res.status}`.startsWith('20')) {
    return res;
  } else if (`${res.status}`.startsWith('4')) {
    throw new GetError('400', '400错误');
  } else if (`${res.status}`.startsWith('5')) {
    throw new GetError('500', '500错误');
  } else {
    throw new GetError('Unkown', '未知错误');
  }
}

function getErrorMsg(error) {
  if (error.code) {
    return errorHandler(error);
  } else {
    console.log('未知错误');
    return {};
  }
}

function errorHandler(error) {
  switch (error.code) {
    case 2000:
    case 2003:
      console.log('登录过期');
      store.dispatch({
        type: LOGOUT,
        data: null
      });
      // 特殊情况，有token但是过期了，isLogin会一直是false，卡在loading页，需要手动踢到登录页
      history.push('/login');
      return {};
      break;
    case 2001:
      console.log('密码错误');
      throw error;
      break;
    case 2010:
      console.log('页面需要刷新');
      refresh();
      throw error;
      break;
    case 3417:
      console.log('创建工单失败');
      throw error;
      break;
    default:
      console.log(error.message);
      throw error;
  }
}

const checkQuery = (url, options) => {
  if (options.query) {
    if (Object.values(options.query).every(p => isNil(p) || p === '')) {
      return url;
    }
    return `${url}?${qs.stringify(
      pickBy(
        options.query,
        (value, key) => value !== '' && value !== null && value !== undefined
      ),
      { indices: false }
    )}`;
  }
  return url;
};

export const fetch = async (url, options = {}) => {
  const requestUrl = checkQuery(url, options);
  try {
    let res = await window.fetch(requestUrl, {
      credentials: 'include',
      ...options,
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8'
      })
    });
    let json = await processRes(res).json();
    return processJson(json);
  } catch (error) {
    return getErrorMsg(error);
  }
};

export const fetchBlob = async (url, options = {}) => {
  const requestUrl = checkQuery(url, options);
  try {
    let res = await window.fetch(requestUrl, {
      credentials: 'include',
      ...options
    });
    let blob = await res.blob();
    download(blob, options.fileName, 'blob');
  } catch (error) {
    return getErrorMsg(error);
  }
};
