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
import nAxios from "../../services/nAxios";

export const getInactiveMerchants = data => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/wps/device`,
      //   params: data
      // });

      dispatch({
        type: FETCH_INACTIVE_MERCHANTS,
        payload: {
          data: [
            {
              merchantName: "Primedia Qatar WLL",
              lastTransactionDate: "17-10-2016",
              daysSinceLastTransaction: "1814",
              pendingInvoices: "QAR 0.00"
            },
            {
              merchantName: "demoacct",
              lastTransactionDate: "19-10-2016",
              daysSinceLastTransaction: "1814",
              pendingInvoices: "QAR 0.00"
            },
            {
              merchantName: "Primedia Qatar WLL",
              lastTransactionDate: "17-10-2016",
              daysSinceLastTransaction: "1814",
              pendingInvoices: "QAR 0.00"
            },
            {
              merchantName: "Primedia Qatar WLL",
              lastTransactionDate: "17-10-2016",
              daysSinceLastTransaction: "1814",
              pendingInvoices: "QAR 0.00"
            },
            {
              merchantName: "Primedia Qatar WLL",
              lastTransactionDate: "17-10-2016",
              daysSinceLastTransaction: "1814",
              pendingInvoices: "QAR 0.00"
            },
            {
              merchantName: "Primedia Qatar WLL",
              lastTransactionDate: "17-10-2016",
              daysSinceLastTransaction: "1814",
              pendingInvoices: "QAR 0.00"
            }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const resetInactiveMerchants = () => {
  return {
    type: RESET_INACTIVE_MERCHANTS
  };
};

export const getChargeBacks = data => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/wps/device`,
      //   params: data
      // });

      dispatch({
        type: FETCH_CHARGE_BACKS,
        payload: {
          data: [
            // {
            //   merchantName:"Padel In",
            //   totalChargebacks:"14",
            //   dateOfLastChargeBack:"01-07-2019",
            // },
            // {
            //   merchantName:"NexxoTesting",
            //   totalChargebacks:"9",
            //   dateOfLastChargeBack:"23-01-2020",
            // }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const resetChargeBacks = () => {
  return {
    type: RESET_CHARGE_BACKS
  };
};

export const getExpiringDocuments = data => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/wps/device`,
      //   params: data
      // });

      dispatch({
        type: FETCH_EXPIRING_DOCUMENTS,
        payload: {
          data: [
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "deepTech",
              docsExpiring: "Commercial Registration",
              daysTillExpiry: "6"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            },
            {
              merchantName: "QIB demo",
              docsExpiring: "Trade License",
              daysTillExpiry: "3"
            }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const resetExpiringDocuments = () => {
  return {
    type: RESET_EXPIRING_DOCUMENTS
  };
};

export const getTopTenMerchants = data => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/wps/device`,
      //   params: data
      // });

      dispatch({
        type: FETCH_TOP_TEN_MERCHANTS,
        payload: {
          data: [
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "2786",
              totalSales: "31416151.96"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            },
            {
              merchantName: "Padel In",
              totalTransactions: "24",
              totalSales: "98114229.45"
            }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const resetTopTenMerchants = () => {
  return {
    type: RESET_TOP_TEN_MERCHANTS
  };
};
