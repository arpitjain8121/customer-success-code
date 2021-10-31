import nAxios from "../../services/nAxios";
import { addMessage } from "../util/action";

import {
  GET_BUSINESS_LIST,
  RESET_LIST,
  GET_MERCHANT_DEVICE,
  GET_BUSINESS_PROFILE,
  GET_KYC_APPROVAL,
  GET_INVOICE_DETAILS,
  GET_DUE_DILIGENCE,
  UPDATE_BUSINESS_PROFILE
} from "./types";

export const getBusinessList = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/business",
        params: data
      });

      dispatch({ type: GET_BUSINESS_LIST, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};
export const resetLists = () => {
  return {
    type: RESET_LIST
  };
};

export const getMerchantDevice = () => {
  return async dispatch => {
    try {
      await nAxios({
        method: "get",
        url: "/bo/business"
      });

      const tempres = [
        {
          uid: "2134-adsf-2435",
          terminalID: "6802893",
          serial: "861097036210981",
          version: "861097036210981",
          assignedOn: "15 Jul, 2021 12:41 PM",
          date: "15 Jul, 2021 12:41 PM",
          unassignedOn: "---",
          status: "ACTIVE",
          deviceName: "MOBILE"
        }
      ];
      dispatch({ type: GET_MERCHANT_DEVICE, payload: tempres });
    } catch (err) {
      throw err;
    }
  };
};

export const getBusinessProfile = (id, data) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: `/bo/business/${id}`,
        params: data
      });

      dispatch({ type: GET_BUSINESS_PROFILE, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getSAdminApproval = data => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/business",
        params: data
      });

      dispatch({ type: GET_KYC_APPROVAL, payload: res.data });
    } catch (err) {
      throw err;
    }
  };
};

export const getInvoiceDetails = data => {
  return async dispatch => {
    try {
      await nAxios({
        method: "get",
        url: "/bo/business",
        params: data
      });

      const tempres = [
        {
          createdOn: "16 Aug, 2021 09:10 AM",
          invoice: "7417",
          tid: "",
          invoiceType: "CREDIT",
          amount: "50",
          discount: "0",
          netAmount: "50",
          amountPaid: "0",
          outstandingAmount: "50",
          status: "Unpaid",
          paidOn: "",
          action: ""
        },
        {
          createdOn: "16 Aug, 2021 09:10 AM",
          invoice: "7416",
          tid: "6223107",
          invoiceType: "Ad Hoc POS Monthly Fee",
          amount: "80",
          discount: "0",
          netAmount: "80",
          amountPaid: "0",
          outstandingAmount: "80",
          status: "Unpaid",
          paidOn: "",
          action: ""
        },
        {
          createdOn: "16 Aug, 2021 09:10 AM",
          invoice: "7415",
          tid: "NAS",
          invoiceType: "CREDIT",
          amount: "95",
          discount: "0",
          netAmount: "95",
          amountPaid: "95",
          outstandingAmount: "0",
          status: "Paid",
          paidOn: "16 Aug, 2021 09:08 AM",
          action: ""
        }
      ];
      dispatch({ type: GET_INVOICE_DETAILS, payload: tempres });
    } catch (err) {
      throw err;
    }
  };
};

export const getDueDiligence = () => {
  return async dispatch => {
    try {
      // await nAxios({
      //   method: "get",
      //   url: `/bo/business/${id}`
      // });

      dispatch({
        type: GET_DUE_DILIGENCE,
        payload: {
          amlSubscribed: [
            {
              label: "IP",
              value: "2401:4900:3316:8eC3"
            }
          ],
          geoSubscribed: [
            {
              label: "IP",
              value: "2401:4900:3316:8eC3"
            },
            {
              label: "City",
              value: "Bengaluru"
            },
            {
              label: "Region",
              value: "Karnataka"
            },
            {
              label: "Region Code",
              value: "KA"
            },
            {
              label: "Country",
              value: "IN"
            },
            {
              label: "Country Name",
              value: "INDIA"
            }
          ],
          browserSubscribed: [
            {
              label: "Browser",
              value: "Chrome"
            },
            {
              label: "Full Version",
              value: "81.0.4044.138"
            },
            {
              label: "Major Version",
              value: "Version"
            },
            {
              label: "Cookies Enabled",
              value: "true"
            }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updateBusiness = (businessId, data) => {
  return async dispatch => {
    try {
      const res = await nAxios({
        method: "patch",
        url: `/bo/business/${businessId}`,
        data
      });

      dispatch({ type: UPDATE_BUSINESS_PROFILE, payload: res.data });
    } catch (err) {
      dispatch(
        addMessage({
          msg:
            err?.data?.message ||
            err?.data ||
            "An error while updating profile.",
          type: "danger",
          modal: true
        })
      );
      throw err;
    }
  };
};
