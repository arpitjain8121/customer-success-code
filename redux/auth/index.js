import { SIGN_IN, SIGN_OUT } from "./types";

import CONSTANTS from "../../constants";

const { ACCESS_TOKEN, REFRESH_TOKEN } = CONSTANTS;

const INITIAL_STATE = {
  accessToken: undefined,
  refreshToken: undefined,
  loggedIn: false
};

const auth = (state = INITIAL_STATE, { type, payload = {} }) => {
  switch (type) {
    case SIGN_IN: {
      const { accessToken, refreshToken } = payload;

      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);

      return { ...state, ...payload, loggedIn: true };
    }
    case SIGN_OUT: {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      return { ...INITIAL_STATE };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
