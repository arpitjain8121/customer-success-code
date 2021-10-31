import axios from "axios";

import constants from "../constants";
import { isTokenExpired } from "../utils";

const { ACCESS_TOKEN, REFRESH_TOKEN } = constants;

async function refetchTokens(refreshToken) {
  try {
    const res = await axios({
      method: "put",
      url: `/connect/token`,
      headers: {
        Authorization: "Bearer " + refreshToken
      }
    });
    return res;
  } catch (err) {
    throw err;
  }
}

async function genNewTokens(aToken, rToken) {
  if (isTokenExpired(aToken)) {
    try {
      const { data: { accessToken, refreshToken } = {} } = await refetchTokens(
        rToken
      );

      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);

      return accessToken;
    } catch (err) {
      throw err;
    }
  }
  return aToken;
}

export default async function nAxios(params) {
  const aToken = localStorage.getItem(ACCESS_TOKEN);
  const rToken = localStorage.getItem(REFRESH_TOKEN);

  let newAccessToken = aToken;

  if (!isTokenExpired(rToken)) {
    newAccessToken = await genNewTokens(aToken, rToken);
  } else {
    return localStorage.clear();
  }

  return axios({
    ...params,
    headers: { ...params.headers, Authorization: `Bearer ${newAccessToken}` }
  }).catch(async err => {
    const { status } = err.response;

    if (status === 401) {
      newAccessToken = await genNewTokens(aToken, rToken);

      return axios({
        ...params,
        headers: {
          ...params.headers,
          Authorization: `Bearer ${newAccessToken}`
        }
      });
    }
    throw err.response;
  });
}
