import { FETCH_DEPARTMENTS } from "./types";

const INITIAL_STATE = {
  departments: undefined
};

const departments = (state = INITIAL_STATE, { type, payload = {} }) => {
  switch (type) {
    case FETCH_DEPARTMENTS: {
      return {
        ...state,
        departments: (payload || []).sort((x, y) =>
          x.departmentName.toLowerCase() > y.departmentName.toLowerCase()
            ? 1
            : -1
        )
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default departments;
