// import { VALIDATE_DOCUMENT } from "./types";

const INITIAL_STATE = {};

const document = (state = INITIAL_STATE, { type, payload = {} }) => {
  switch (type) {
    default: {
      return { ...state };
    }
  }
};

export default document;
