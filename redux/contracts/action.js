import nAxios from "../../services/nAxios";

import { FETCH_CONTRACTS, SAVE_CONTRACTS } from "./types";

export const fetchContracts = ({ mid }) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/contract/details/${mid}`
        // url: `/bo/contract/details/E31C416DAA755B33`
      });

      dispatch({ type: FETCH_CONTRACTS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const upadateContracts = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "put",
        url: `/bo/contract/${data.contractId}`,
        // url: `/bo/contract/E31C416DAA755B33`,
        data
      });

      dispatch({ type: SAVE_CONTRACTS, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};
