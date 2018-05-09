import { CHANGE_THEME } from 'constants/actionTypes';

export const changeTheme = theme => dispatch =>
  dispatch({
    type: CHANGE_THEME,
    theme: theme
  });
