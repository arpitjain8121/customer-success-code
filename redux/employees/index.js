import {
  CREATE_EMPLOYEE,
  FETCH_EMPLOYEES,
  FETCH_EMPLOYEE,
  UPDATE_EMPLOYEE,
  RESET_ACTIVE_EMPLOYEE,
  RESET_EMPLOYEES
} from "./types";

const INITIAL_STATE = {
  employees: undefined,
  activeEmp: undefined,
  activeEmpUid: undefined
};

const employees = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_EMPLOYEES: {
      return { ...state, employees: payload };
    }
    case FETCH_EMPLOYEE: {
      return { ...state, activeEmp: payload, activeEmpUid: payload.uid };
    }
    case CREATE_EMPLOYEE: {
      return { ...state, activeEmpUid: payload?.uid };
    }
    case RESET_EMPLOYEES: {
      return { ...INITIAL_STATE };
    }
    case UPDATE_EMPLOYEE: {
      return { ...state, activeEmp: payload, activeEmpUid: payload.uid };
    }
    case RESET_ACTIVE_EMPLOYEE: {
      return { ...state, activeEmp: undefined, activeEmpUid: undefined };
    }
    default: {
      return { ...state };
    }
  }
};

export default employees;
