import {
  FETCH_PAYOUTS,
  RESET_PAYOUTS,
  FETCH_PAYOUTS_TRANSACTION
} from "./types";
import nAxios from "../../services/nAxios";

export const getPayouts = data => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/wps/device`,
      //   params: data
      // });

      dispatch({
        type: FETCH_PAYOUTS,
        payload: {
          data: [
            {
              payoutDate: "02 Aug, 2021 01:56 PM",
              transactionDateRange:
                "02 Aug, 2021 01:46 PM to 02 Aug, 2021 01:47 PM",
              businessName: "Test Merchant",
              businessId: "117706253024",
              settlementAccountNumber: "2",
              totalNumberOfTransaction: "1",
              totalTransactionAmount: "9204.00",
              monthlyFee: "592.22",
              commission: "	183.16",
              disputeAmount: "0.00",
              totalRefundTransaction: "0",
              refundTransactionAmount: "0.00",
              setupFee: "0.00",
              securityDeposit: "0.00",
              transferFee: "0",
              payoutAmount: "8428.62",
              invoiceType: "POS",
              status: "Pending",
              gateway: "QIB",
              pastRecoveryFees: "0.00",
              action: "action"
            },
            {
              payoutDate: "02 Aug, 2021 01:56 PM",
              transactionDateRange:
                "02 Aug, 2021 01:48 PM to 02 Aug, 2021 01:49 PM",
              businessName: "Test Merchant1",
              businessId: "117706253025",
              settlementAccountNumber: "3",
              totalNumberOfTransaction: "2",
              totalTransactionAmount: "9204.00",
              monthlyFee: "592.22",
              commission: "	183.16",
              disputeAmount: "0.00",
              totalRefundTransaction: "0",
              refundTransactionAmount: "0.00",
              setupFee: "0.00",
              securityDeposit: "0.00",
              transferFee: "0",
              payoutAmount: "8428.62",
              invoiceType: "POS",
              status: "Pending",
              gateway: "QNB",
              pastRecoveryFees: "0.00",
              action: "action"
            }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const getPayoutsTransactions = data => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: `/wps/device`
      // });

      dispatch({
        type: FETCH_PAYOUTS_TRANSACTION,
        payload: {
          data: [
            {
              transactionDate: "28 Jul, 2021 08:19 AM",
              transactionAmount: "2400",
              transactionFees: "61",
              netAmount: "2339",
              transactionId: "120905313433",
              referenceNumber: "CRT-2021-0932"
            },
            {
              transactionDate: "29 Jul, 2021 08:19 AM",
              transactionAmount: "2500",
              transactionFees: "67",
              netAmount: "2337",
              transactionId: "120905313434",
              referenceNumber: "CRT-2021-0933"
            }
          ]
        }
      });
    } catch (err) {
      throw err;
    }
  };
};

export const resetPayouts = () => {
  return {
    type: RESET_PAYOUTS
  };
};

export const searchPartners = q => {
  return async () => {
    try {
      const res = await nAxios({
        method: "get",
        url: "/bo/autocomplete/partner",
        params: { search: q }
      });

      return (res.data || []).map(({ id, name }) => ({
        value: id,
        label: name
      }));
    } catch (err) {
      throw err;
    }
  };
};
