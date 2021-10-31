import { FETCH_TRANSACTIONS, RESET_TRANSACTIONS } from "./types";

const INITIAL_STATE = {
  transactions: undefined
};

const reports = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_TRANSACTIONS: {
      return { ...state, transactions: payload.data };
    }
    case RESET_TRANSACTIONS: {
      return { ...INITIAL_STATE };
    }
    default: {
      return { ...state };
    }
  }
};

export default reports;
