import nAxios from "../../services/nAxios";

import { FETCH_DEPARTMENTS } from "./types";

export const getDepartments = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/wps/department",
        params: data
      });

      dispatch({ type: FETCH_DEPARTMENTS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const createDepartment = data => {
  return async dispatch => {
    try {
      await nAxios({
        method: "post",
        url: "/wps/department",
        data
      });

      dispatch(getDepartments());
    } catch (err) {
      throw err;
    }
  };
};

export const deleteDepartment = id => {
  return async dispatch => {
    try {
      await nAxios({
        method: "delete",
        url: `/wps/department/${id}`
      });

      dispatch(getDepartments());
    } catch (err) {
      throw err;
    }
  };
};
