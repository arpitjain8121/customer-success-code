import { combineReducers } from "redux";
import { SIGN_OUT } from "./auth/types";

import auth from "./auth";
import document from "./document";
import business from "./business";
import permissions from "./permission";
import utils from "./util";
import terminals from "./terminals";
import transactions from "./transactions";
import contracts from "./contracts";
import payouts from "./payouts";
import approvals from "./approvals";
import applications from "./applications";
import dashboard from "./dashboard";

const appReducer = combineReducers({
  auth,
  document,
  business,
  permissions,
  terminals,
  utils,
  transactions,
  contracts,
  payouts,
  approvals,
  applications,
  dashboard
});

const rootReducer = (state, action) => {
  // for clearing the whole state
  if (action.type === SIGN_OUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
