import nAxios from "../../services/nAxios";
import { addMessage } from "../util/action";

import { FETCH_TRANSACTIONS, RESET_TRANSACTIONS } from "./types";

export const getSettledTransactions = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/transaction/settled`,
        params: data
      });

      dispatch({ type: FETCH_TRANSACTIONS, payload: { data: res.data } });
    } catch (err) {
      throw err;
    }
  };
};

export const getRefundsTransactions = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/transaction/refund`,
        params: data
      });

      dispatch({ type: FETCH_TRANSACTIONS, payload: { data: res.data } });
    } catch (err) {
      throw err;
    }
  };
};

export const getUnsucessfullTransactions = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/transaction/failed`,
        params: data
      });

      dispatch({ type: FETCH_TRANSACTIONS, payload: { data: res.data } });
    } catch (err) {
      throw err;
    }
  };
};

export const resetTransactions = () => {
  return {
    type: RESET_TRANSACTIONS
  };
};

export const sendPdf = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "post",
        url: `/bo/business/send_pdf`
      });
      // dispatch({
      //   type: SEND_PDF,
      //   payload: { data: res.data }
      // });

      dispatch(
        addMessage({
          msg: "Email sent successfully. Showing result for last 7 days now.",
          extra: { title: "Success" }
        })
      );
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.message ||
            "Can't send email. Showing result for last 7 days now.",
          type: "danger"
        })
      );
      throw err;
    }
  };
};
