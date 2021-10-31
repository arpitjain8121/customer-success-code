import axios from "axios";
import nAxios from "../../services/nAxios";

import { isTokenExpired } from "../../utils";
import CONSTANTS from "../../constants";

import { SIGN_IN, SIGN_OUT } from "./types";

import { CHANGE_LOCALE } from "../util/types";

const { ACCESS_TOKEN, REFRESH_TOKEN, LOCALE } = CONSTANTS;

export const signIn = data => {
  return async dispatch => {
    try {
      const res = await axios({
        method: "post",
        url: `/passive/token`,
        data
      });

      dispatch({
        type: SIGN_IN,
        payload: {
          ...res.data
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const restoreSession = () => {
  return dispatch => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const locale = localStorage.getItem(LOCALE);

    if (accessToken && !isTokenExpired(accessToken)) {
      dispatch({
        type: SIGN_IN,
        payload: { accessToken, refreshToken }
      });
    }

    if (locale) {
      dispatch({ type: CHANGE_LOCALE, payload: { locale } });
    }
  };
};

export const logout = () => {
  return async dispatch => {
    try {
      await nAxios({
        method: "put",
        url: `/connect/logout`
      });

      dispatch({ type: SIGN_OUT });
    } catch (err) {
      throw err;
    }
  };
};
