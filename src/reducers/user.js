// 储存与用户有关的信息,包括是否登录,权限
import { LOGIN, LOGOUT } from '../constants/actionTypes';
import Oss from '../lib/oss';

let isRemember = localStorage.getItem('remember') === 'true';
const initialState = {
  isLogin: false,
  authority: 0,
  groupId: '',
  logoUrl: '',
  username: '',
  userId: null,
  remember: isRemember,
  rememberName: localStorage.getItem('rememberName'),
  authList: []
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem('remember', action.data.remember);
      localStorage.setItem('rememberName', action.data.rememberName);
      localStorage.setItem('groupId', action.data.groupId);
      return {
        ...state,
        isLogin: true,
        authList: action.data.authorities,
        authority: action.data.authority,
        groupId: action.data.groupId,
        logoUrl: action.data.logoUrl,
        rememberName: action.data.rememberName,
        remember: action.data.remember,
        username: action.data.name,
        userId: action.data.id
      };
    case LOGOUT:
      isRemember = localStorage.getItem('remember') === 'true';
      !isRemember && localStorage.setItem('rememberName', '');
      return {
        ...state,
        isLogin: false,
        authList: [],
        authority: 0,
        groupId: '',
        logoUrl: '',
        username: '',
        userId: null,
        remember: isRemember,
        rememberName: localStorage.getItem('rememberName')
      };
    default:
      return state;
  }
};
