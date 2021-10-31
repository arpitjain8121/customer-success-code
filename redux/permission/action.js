import nAxios from "../../services/nAxios";

import { FETCH_PERMISSIONS } from "./types";

export const getPermissions = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/connect/acl"
      });

      dispatch({
        type: FETCH_PERMISSIONS,
        payload: res.data
      });
    } catch (err) {
      throw err;
    }
  };
};
