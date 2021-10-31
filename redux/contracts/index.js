import { FETCH_CONTRACTS } from "./types";

const INITIAL_STATE = {
  contracts: []
};

const contracts = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_CONTRACTS: {
      return { ...state, contracts: payload };
    }

    default: {
      return { ...state };
    }
  }
};

export default contracts;
