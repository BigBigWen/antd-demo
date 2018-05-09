import { CHANGE_THEME } from 'constants/actionTypes';
import { themes } from 'constants/const';

const initialState = {
  theme: parseFloat(sessionStorage.getItem('theme')) || 0
};

export const global = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      const theme = (state.theme + 1) % themes.length;
      sessionStorage.setItem('theme', theme);
      return Object.assign({}, { ...state }, { theme });
    default:
      return state;
  }
};
