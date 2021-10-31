import {
  FETCH_PAYOUTS,
  FETCH_PAYOUTS_TRANSACTION,
  RESET_PAYOUTS
} from "./types";

const INITIAL_STATE = {
  payouts: undefined,
  payout_transaction: undefined
};

const reports = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_PAYOUTS: {
      return { ...state, payouts: payload.data };
    }
    case FETCH_PAYOUTS_TRANSACTION: {
      return { ...state, payout_transaction: payload.data };
    }
    case RESET_PAYOUTS: {
      return { ...INITIAL_STATE };
    }
    default: {
      return { ...state };
    }
  }
};

export default reports;
