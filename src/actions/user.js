import { LOGIN, LOGOUT } from '../constants/actionTypes';
import { postLogin, getLogin, deleteLogin } from 'rest/api/Login';
import history from '../lib/history';
import Oss from '../lib/oss';

export const login = (
  userInfo,
  callback = err => console.log(err)
) => async dispatch => {
  try {
    const data = await postLogin(JSON.stringify(userInfo));
    const logoUrl = await Oss.getFileUrl((data.groupParameter || {}).logoUrl);
    dispatch({
      type: LOGIN,
      data: {
        ...data,
        logoUrl,
        remember: userInfo.remember,
        rememberName: userInfo.uid
      }
    });
    history.push('/');
  } catch (err) {
    callback(err);
  }
};

export const logOut = () => async dispatch => {
  await deleteLogin();
  dispatch({
    type: LOGOUT,
    data: null
  });
};

export const initAuth = () => async dispatch => {
  const data = await getLogin();
  const logoUrl = await Oss.getFileUrl((data.groupParameter || {}).logoUrl);
  dispatch({
    type: LOGIN,
    data: {
      ...data,
      logoUrl
    }
  });
};
