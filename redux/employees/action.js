import FormData from "form-data";
import { createIntl, createIntlCache } from "react-intl";

import nAxios from "../../services/nAxios";
import { addMessage } from "../util/action";

import {
  CHANGE_DEPARTMENT,
  CREATE_EMPLOYEE,
  FETCH_EMPLOYEES,
  RESET_EMPLOYEES,
  FETCH_EMPLOYEE,
  UPDATE_EMPLOYEE,
  UPDATE_ACCOUNT,
  UPDATE_KYC,
  UPDATE_SALARY,
  RESET_ACTIVE_EMPLOYEE
} from "./types";

const cache = createIntlCache();

const intl = createIntl(
  // way for getting access to intl object outside react
  {
    locale: "en"
  },
  cache
);

export const getEmployees = ({
  search = "",
  department = 0,
  documentType = 0,
  kycStatus = 0,
  sort = "employeeNumber",
  pageNumber = 0,
  pageSize = 20
}) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/wps/employee",
        params: {
          search,
          department,
          kycStatus,
          sort,
          pageNumber,
          pageSize,
          documentType
        }
      });
      dispatch({ type: FETCH_EMPLOYEES, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getEmployee = id => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/wps/employee/${id}`
      });

      dispatch({ type: FETCH_EMPLOYEE, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const createEmployee = ({ empProfilePic, ...rest }) => {
  return async dispatch => {
    try {
      const form = new FormData();

      if (empProfilePic) {
        form.append("empProfilePic", empProfilePic);
      }

      for (const key in rest) {
        form.append(`${key}`, rest[key]);
      }

      const res = await nAxios({
        method: "post",
        url: "/wps/employee",
        data: form
      });

      dispatch({ type: CREATE_EMPLOYEE, payload: res.data });
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.errors ??
            intl.formatMessage({
              defaultMessage: "Something went wrong. Please try again later."
            }),
          type: "danger",
          modal: true
        })
      );
      throw err;
    }
  };
};

export const updateEmployee = (id, { empProfilePic, ...rest }) => {
  return async dispatch => {
    try {
      const form = new FormData();

      if (empProfilePic) {
        form.append("empProfilePic", empProfilePic);
      }

      for (const key in rest) {
        form.append(`${key}`, rest[key]);
      }

      const res = await nAxios({
        method: "patch",
        url: `/wps/employee/${id}/details`,
        data: form
      });

      dispatch({ type: UPDATE_EMPLOYEE, payload: res.data });
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.errors ??
            intl.formatMessage({
              defaultMessage: "Something went wrong. Please try again later."
            }),
          type: "danger",
          modal: true
        })
      );
      throw err;
    }
  };
};

export const updateKyc = (id, { documentPic, ...rest }) => {
  return async dispatch => {
    try {
      const form = new FormData();

      if (Array.isArray(documentPic) && documentPic.length > 0) {
        documentPic.forEach((pic, index) => {
          form.append(`documentPic[${index}]`, pic);
        });
      }

      for (const key in rest) {
        form.append(`${key}`, rest[key]);
      }

      const res = await nAxios({
        method: "patch",
        url: `/wps/employee/${id}/kyc`,
        data: form
      });

      dispatch({ type: UPDATE_KYC, payload: res.data });
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.errors ??
            intl.formatMessage({
              defaultMessage: "Something went wrong. Please try again later."
            }),
          type: "danger",
          modal: true,
          extra: {
            title: intl.formatMessage(
              {
                defaultMessage: "Error in {documentType}"
              },
              {
                documentType: {
                  30: "Passport",
                  5: "QID",
                  35: "VISA"
                }[rest.documentTypeId]
              }
            )
          }
        })
      );
      throw err;
    }
  };
};

export const updateSalary = (id, data) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        data,
        method: "patch",
        url: `/wps/employee/${id}/salary`
      });

      dispatch({ type: UPDATE_SALARY, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const updateAccount = (id, data) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        data,
        method: "patch",
        url: `/wps/employee/${id}/account`
      });

      dispatch({ type: UPDATE_ACCOUNT, payload: res.data });
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.errors ??
            intl.formatMessage({
              defaultMessage: "Something went wrong. Please try again later."
            }),
          type: "danger",
          modal: true
        })
      );
      throw err;
    }
  };
};

export const moveEmpolyee = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "put",
        url: `/wps/employee/department`,
        data
      });

      dispatch({ type: CHANGE_DEPARTMENT, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const resetEmp = () => {
  return {
    type: RESET_EMPLOYEES
  };
};

export const resetActiveEmployee = () => {
  return {
    type: RESET_ACTIVE_EMPLOYEE
  };
};

export const deactivateEmployee = (empId, data) => {
  return async () => {
    try {
      const form = new FormData();

      for (const key in data) {
        form.append(`${key}`, data[key]);
      }

      await nAxios({
        method: "post",
        url: `/wps/employee/deactivate/${empId}`,
        data: form
      });
    } catch (err) {
      throw err;
    }
  };
};

export const activateEmployee = (empId, flag) => {
  return async () => {
    try {
      await nAxios({
        method: "post",
        url: `/wps/employee/updateaccountstatus`,
        data: { employeeId: empId, decisionFlag: flag }
      });
    } catch (err) {
      throw err;
    }
  };
};
