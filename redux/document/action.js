import axios from "axios";

import { VALIDATE_DOCUMENT } from "./types";

export const validateDocument = documentId => {
  return async dispatch => {
    try {
      await axios({
        method: "get",
        url: `/passive/document?documentId=${documentId}`
      });

      dispatch({ type: VALIDATE_DOCUMENT });
    } catch (err) {
      throw err;
    }
  };
};
