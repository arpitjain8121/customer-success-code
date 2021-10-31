import nAxios from "../../services/nAxios";
import { addMessage } from "../util/action";

import {
  GET_APPLICATIONS,
  GET_APPLICATION_STATUS,
  RESET_APPLICATIONS,
  FETCH_APPLICATION,
  UPLOAD_KYC_DOCS,
  UPDATE_KYC_DETAILS,
  UPDATE_KYC_STATUS
} from "./types";

export const getApplicationStatus = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/kyc/business/status/aggregate`,
        params: data
      });
      dispatch({ type: GET_APPLICATION_STATUS, payload: { data: res.data } });
    } catch (err) {
      throw err;
    }
  };
};

export const getApplications = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/kyc/business`,
        params: data
      });
      dispatch({ type: GET_APPLICATIONS, payload: { data: res.data } });
    } catch (err) {
      throw err;
    }
  };
};

export const resetApplications = () => {
  return {
    type: RESET_APPLICATIONS
  };
};

export const fetchApplication = ({ id }) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/kyc/${id}`
      });

      dispatch({
        type: FETCH_APPLICATION,
        payload: res.data
      });
    } catch (err) {
      throw err;
    }
  };
};

export const uploadKycDocuments = ({ file, ...rest }) => {
  return async dispatch => {
    try {
      const form = new FormData();

      if (Array.isArray(file) && file.length > 0) {
        file.forEach((item, index) => {
          form.append(`file[${index}]`, item);
        });
      } else {
        form.append("file", file);
      }

      for (const key in rest) {
        if (rest[key]) {
          form.append(`${key}`, rest[key]);
        }
      }

      const res = await nAxios({
        method: "post",
        url: `/bo/kyc/business`,
        data: form
      });

      dispatch({
        type: UPLOAD_KYC_DOCS,
        payload: res.data
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updateKycDetails = ({ businessId, documentTypeId, ...rest }) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "patch",
        url: `/bo/kyc/business`,
        params: {
          businessId,
          documentTypeId
        },
        data: rest
      });

      dispatch({
        type: UPDATE_KYC_DETAILS,
        payload: res.data
      });
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.message ||
            err?.data ||
            "An error while updating profile.",
          type: "danger",
          modal: true
        })
      );
      throw err;
    }
  };
};

export const updateKycStatus = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "put",
        url: `/bo/kyc/status`,
        data
      });

      dispatch({
        type: UPDATE_KYC_STATUS,
        payload: res.data
      });
    } catch (err) {
      throw err;
    }
  };
};
