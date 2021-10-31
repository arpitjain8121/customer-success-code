import nAxios from "../../services/nAxios";

import {
  FETCH_CARDS,
  GET_CARDS,
  GET_CARD_DETAILS,
  RESET_CARDS,
  FETCH_CARDS_HISTORY,
  FETCH_CARDS_RECORD,
  FETCH_STATUS,
  FETCH_MESSAGE
} from "./types";

export const getCardDetails = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/wps/card/dashboard"
      });

      dispatch({ type: GET_CARD_DETAILS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getCards = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/wps/card",
        params: data
      });

      dispatch({ type: GET_CARDS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getOrderCardHistory = ({
  search = "",
  pageNumber = 0,
  pageSize = 20,
  sort = "referenceNumber"
}) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "wps/card/batch",
        params: {
          search,
          sort,
          pageNumber,
          pageSize
        }
      });

      dispatch({ type: FETCH_CARDS_HISTORY, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const resetCards = () => {
  return {
    type: RESET_CARDS
  };
};

export const getOrderCardRecord = ({
  pageNumber = 0,
  pageSize = 20,
  uid,
  sort = "employeeID"
}) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `wps/card/batch/${uid}`,
        params: {
          sort,
          pageNumber,
          pageSize
        }
      });

      dispatch({ type: FETCH_CARDS_RECORD, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getOrderCard = ({
  search = "",
  departmentId = 0,
  sort = "employeeID",
  pageNumber = 0,
  pageSize = 20,
  cardStatus = ""
}) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "wps/card/employee",
        params: {
          search,
          departmentId,
          sort,
          pageNumber,
          pageSize,
          cardStatus
        }
      });

      dispatch({ type: FETCH_CARDS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getStatus = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/wps/card/status/filter"
      });
      dispatch({ type: FETCH_STATUS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getOrderCardMessage = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "post",
        url: "/wps/card/employee",
        data
      });

      return dispatch({ type: FETCH_MESSAGE, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};
