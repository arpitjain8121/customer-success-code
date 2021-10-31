import nAxios from "../../services/nAxios";
import axios from "axios";

import {
  GET_WALLET_BALANCE,
  GET_TRANSACTION_DETAILS,
  GET_TRANSACTION_STATUS
} from "./types";

export const getWalletBalance = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/connect/wallet/balance"
      });

      dispatch({ type: GET_WALLET_BALANCE, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getTransactionDetails = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/connect/transaction",
        params: data
      });
      dispatch({ type: GET_TRANSACTION_DETAILS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const postAddMoney = amount => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "patch",
        url: "/connect/add/money",
        data: { amount }
      });

      dispatch({ type: GET_TRANSACTION_STATUS, payload: res.data });

      const {
        action,
        gatewayId,
        secretId,
        referenceId,
        amount: money,
        currency,
        mode,
        description,
        returnUrl,
        name,
        address,
        city,
        state,
        postalCode,
        country,
        phone,
        email,
        serverUrl
      } = res.data;

      const data = {
        action,
        gatewayId,
        secretKey: secretId,
        referenceId,
        amount: money,
        currency,
        mode,
        description,
        returnUrl,
        name,
        address,
        city,
        state,
        postalCode,
        country,
        phone,
        email
      };

      const form = document.createElement("form");
      form.action = serverUrl;
      form.method = "POST";
      form.name = "frmTransaction";
      form.id = "frmTransaction";

      for (const key in data) {
        const input1 = document.createElement("input");
        input1.name = key;
        input1.value = data[key];
        form.appendChild(input1);
      }

      const submit1 = document.createElement("input");
      submit1.type = "submit";
      submit1.value = "submit";
      form.appendChild(submit1);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      throw err;
    }
  };
};

export const submitAddMoney = data => {
  const { serverUrl } = data;
  const form = new FormData();
  for (const key in data) {
    form.append(`${key}`, data[key]);
  }
  return async dispatch => {
    try {
      const res = await axios({
        method: "post",
        url: serverUrl,
        data: form,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      dispatch({ type: GET_TRANSACTION_STATUS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const saveProfileDetails = data => {
  return async dispatch => {
    try {
      await nAxios({
        method: "put",
        url: "/connect/business/profile",
        data: data
      });
    } catch (err) {
      throw err;
    }
  };
};

export const verifyPhone = phone => {
  return async dispatch => {
    try {
      await nAxios({
        method: "post",
        url: `/connect/phone/otp/+974-${phone}`
      });
    } catch (err) {
      throw err;
    }
  };
};
