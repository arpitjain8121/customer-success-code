import {
  FETCH_INACTIVE_MERCHANTS,
  RESET_INACTIVE_MERCHANTS,
  FETCH_CHARGE_BACKS,
  RESET_CHARGE_BACKS,
  FETCH_EXPIRING_DOCUMENTS,
  RESET_EXPIRING_DOCUMENTS,
  FETCH_TOP_TEN_MERCHANTS,
  RESET_TOP_TEN_MERCHANTS
} from "./types";

const INITIAL_STATE = {
  inactiveMerchants: undefined,
  chargeBacks: undefined,
  expiringDocuments: undefined,
  topTenMerchants: undefined
};

const reports = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_INACTIVE_MERCHANTS: {
      return { ...state, inactiveMerchants: payload.data };
    }
    case RESET_INACTIVE_MERCHANTS: {
      return { ...INITIAL_STATE };
    }
    case FETCH_CHARGE_BACKS: {
      return { ...state, chargeBacks: payload.data };
    }
    case RESET_CHARGE_BACKS: {
      return { ...INITIAL_STATE };
    }
    case FETCH_EXPIRING_DOCUMENTS: {
      return { ...state, expiringDocuments: payload.data };
    }
    case RESET_EXPIRING_DOCUMENTS: {
      return { ...INITIAL_STATE };
    }
    case FETCH_TOP_TEN_MERCHANTS: {
      return { ...state, topTenMerchants: payload.data };
    }
    case RESET_TOP_TEN_MERCHANTS: {
      return { ...INITIAL_STATE };
    }
    default: {
      return { ...state };
    }
  }
};

export default reports;
