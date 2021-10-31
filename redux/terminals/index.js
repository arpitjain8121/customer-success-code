import { FETCH_TERMINALS, ASSIGNED_TERMINALS, RESET_TERMINALS } from "./types";

const INITIAL_STATE = {
  terminals: undefined,
  assignedTerminal: undefined
};

const auth = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_TERMINALS: {
      return { ...state, [payload?.type ?? "terminals"]: payload.data };
    }
    case ASSIGNED_TERMINALS: {
      return { ...state, assignedTerminal: payload || [] };
    }
    case RESET_TERMINALS: {
      return { ...INITIAL_STATE };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
