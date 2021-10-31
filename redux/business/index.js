import {
  GET_BUSINESS_LIST,
  RESET_LIST,
  GET_MERCHANT_DEVICE,
  GET_BUSINESS_PROFILE,
  GET_KYC_APPROVAL,
  GET_INVOICE_DETAILS,
  GET_DUE_DILIGENCE
} from "./types";

const INITIAL_STATE = {
  lists: undefined,
  device: undefined,
  profile: undefined,
  kycAppr: undefined,
  invoice: undefined,
  diligence: undefined,
  city: undefined,
  branchDetails: undefined
};

const business = (state = INITIAL_STATE, { type, payload = {} }) => {
  switch (type) {
    case GET_BUSINESS_LIST: {
      return { ...state, lists: payload || [] };
    }

    case GET_MERCHANT_DEVICE: {
      return { ...state, device: payload || [] };
    }

    case GET_BUSINESS_PROFILE: {
      return { ...state, profile: payload || [] };
    }

    case GET_KYC_APPROVAL: {
      return { ...state, kycAppr: payload || [] };
    }

    case GET_INVOICE_DETAILS: {
      return { ...state, invoice: payload || [] };
    }

    case GET_DUE_DILIGENCE: {
      return { ...state, diligence: payload || [] };
    }

    case RESET_LIST: {
      return { ...INITIAL_STATE };
    }

    default: {
      return { ...state };
    }
  }
};

export default business;
