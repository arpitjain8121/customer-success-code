import nAxios from "../../services/nAxios";

import { FETCH_TERMINALS, ASSIGNED_TERMINALS, RESET_TERMINALS } from "./types";

export const getTerminals = ({ type, search, merchant, sort, pageNumber }) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/device`,
        params: {
          pageNumber,
          pageSize: 20,
          deviceStatusId: type || 2,
          search,
          name: merchant,
          sort: [sort]
        }
      });

      dispatch({
        type: FETCH_TERMINALS,
        payload: {
          data: res.data,
          type
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updatePasscode = ({ businessDeviceId, devicePasscode }) => {
  return async () => {
    try {
      await nAxios({
        method: "patch",
        url: `/bo/device`,
        data: {
          businessDeviceId,
          devicePasscode
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const changeStatus = ({ id, ProofFileForStatusChange, ...rest }) => {
  return async () => {
    try {
      const form = new FormData();

      if (ProofFileForStatusChange) {
        form.append("ProofFileForStatusChange", ProofFileForStatusChange);
      }

      for (const key in rest) {
        if (rest[key]) {
          form.append(`${key}`, rest[key]);
        }
      }

      await nAxios({
        method: "put",
        url: `/bo/device/${id}`,
        data: form
      });
    } catch (err) {
      throw err;
    }
  };
};

export const getAssignedTerminal = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "post",
        url: "/bo/device",
        data
      });
      return dispatch({ type: ASSIGNED_TERMINALS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const resetTerminals = () => {
  return {
    type: RESET_TERMINALS
  };
};
