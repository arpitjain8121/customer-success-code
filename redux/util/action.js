import axios from "axios";
import nAxios from "../../services/nAxios";
import CONSTANTS from "../../constants";

import {
  FETCH_COUNTRIES,
  CHANGE_LOCALE,
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  FETCH_SOURCES,
  FETCH_PRODUCTS,
  FETCH_PARTNERS,
  FETCH_BUSINESS_TYPES,
  FETCH_BANKS
} from "./types";

const { DEFAULT_LOCALE } = CONSTANTS;

const countryLocale = "ar";

export const getCountries = () => {
  return async dispatch => {
    try {
      const res = await axios({
        method: "get",
        url: "/passive/countries"
      });

      dispatch({ type: FETCH_COUNTRIES, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const toggleLocale = locale => {
  return {
    type: CHANGE_LOCALE,
    payload: {
      locale: locale === DEFAULT_LOCALE ? countryLocale : DEFAULT_LOCALE
    }
  };
};

export const addMessage = data => {
  return dispatch => {
    const id = Date.now();

    setTimeout(() => {
      dispatch(removeMessage(id));
    }, 15 * 1000);

    dispatch({
      type: ADD_MESSAGE,
      payload: { ...data, id }
    });
  };
};

export const removeMessage = id => {
  return {
    type: REMOVE_MESSAGE,
    payload: { id }
  };
};

export const searchMerchants = ({ q, productList }) => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/autocomplete/business",
        params: { search: q, productList }
      });

      return (res.data || []).map(({ name, uid }) => ({
        value: name,
        label: name,
        uid: uid
      }));
    } catch (err) {
      throw err;
    }
  };
};

export const searchPartners = q => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/autocomplete/partner",
        params: { search: q }
      });

      return (res.data || []).map(({ id, name }) => ({
        value: id,
        label: name
      }));
    } catch (err) {
      throw err;
    }
  };
};

export const getSources = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/transaction/sourceType`
      });
      dispatch({
        type: FETCH_SOURCES,
        payload: {
          data: (res.data || []).map(({ id, name }) => ({
            value: id,
            label: name
          }))
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const getProducts = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/productlist`
      });
      dispatch({
        type: FETCH_PRODUCTS,
        payload: { data: res.data }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const getPartners = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/autocomplete/partner`
      });
      dispatch({
        type: FETCH_PARTNERS,
        payload: { data: res.data }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const searchRisk = q => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/autocomplete/risklevel",
        params: { search: q }
      });

      return (res.data || []).map(({ id, name }) => ({
        value: id,
        label: name
      }));
    } catch (err) {
      throw err;
    }
  };
};

export const searchVertical = q => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/autocomplete/verticals",
        params: { search: q }
      });

      return (res.data || []).map(({ id, name, value }) => ({
        id,
        value,
        label: name
      }));
    } catch (err) {
      throw err;
    }
  };
};

export const getMccCode = q => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/autocomplete/mcc",
        params: { search: q }
      });

      return (res.data || []).map(({ categoryCode, name, id, status }) => ({
        value: categoryCode,
        label: name,
        id,
        status
      }));
    } catch (err) {
      throw err;
    }
  };
};

export const fetchBusinessTypes = () => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/bo/autocomplete/partner`
      // });

      dispatch({
        type: FETCH_BUSINESS_TYPES,
        payload: [
          { id: 1, value: "Public" },
          { id: 2, value: "Private" },
          { id: 3, value: "Sole Proprietorship" },
          { id: 4, value: "Joint Venture" }
        ]
      });
    } catch (err) {
      throw err;
    }
  };
};

export const getCityDetails = async pinCode => {
  try {
    const res = await nAxios({
      method: "get",
      url: `/passive/city`,
      params: {
        search: pinCode
      }
    });

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getBranchDetails = (bankId, ifsc) => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/connect/autocomplete/${bankId}/ifsc`,
        params: { search: ifsc }
      });

      return (res.data || []).map(({ branchId, ifsc, ...rest }) => ({
        value: branchId,
        label: ifsc,
        ...rest
      }));
    } catch (err) {
      throw err;
    }
  };
};

export const fetchBanks = () => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/connect/filter/bank`
      });
      dispatch({
        type: FETCH_BANKS,
        payload: (res.data || []).map(({ bankId, bankName, ifscPrefix }) => ({
          value: bankId,
          label: bankName,
          ifscPrefix
        }))
      });
    } catch (err) {
      throw err;
    }
  };
};
