import {
  GET_WALLET_BALANCE,
  GET_TRANSACTION_DETAILS,
  GET_TRANSACTION_STATUS
} from "./types";

const INITIAL_STATE = {
  walletBalance: undefined,
  transactions: undefined,
  transactionsStatus: undefined
};

const myAccount = (state = INITIAL_STATE, { type, payload = {} }) => {
  switch (type) {
    case GET_WALLET_BALANCE: {
      return { ...state, walletBalance: payload };
    }

    case GET_TRANSACTION_DETAILS: {
      return { ...state, transactions: payload };
    }

    case GET_TRANSACTION_STATUS: {
      return { ...state, transactionsStatus: payload };
    }

    default: {
      return { ...state };
    }
  }
};

export default myAccount;
