import { FETCH_APPROVALS } from "./types";

const INITIAL_STATE = {
  approvals: undefined
};

const approvals = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_APPROVALS: {
      return { ...state, approvals: payload };
    }
    default: {
      return { ...state };
    }
  }
};

export default approvals;
