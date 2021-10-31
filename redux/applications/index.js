import {
  GET_APPLICATIONS,
  RESET_APPLICATIONS,
  FETCH_APPLICATION,
  GET_APPLICATION_STATUS,
  UPLOAD_KYC_DOCS
} from "./types";

const INITIAL_STATE = {
  applications: undefined,
  activeApplication: undefined,
  application_status: undefined
};

const applications = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_APPLICATIONS: {
      return { ...state, applications: payload.data };
    }

    case GET_APPLICATION_STATUS: {
      return { ...state, application_status: payload.data };
    }

    case RESET_APPLICATIONS: {
      return { ...INITIAL_STATE };
    }

    case FETCH_APPLICATION: {
      return { ...state, activeApplication: payload };
    }

    // case UPLOAD_KYC_DOCS: {
    //   return { ...state, activeApplication: payload };
    // }

    default: {
      return { ...state };
    }
  }
};

export default applications;
