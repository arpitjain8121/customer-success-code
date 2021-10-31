import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";

import { useFilters } from "../../components/common";
import PayoutsComp from "../../components/payouts";
import payoutsColumns from "../../components/payouts/payoutsColumn";
import usePrevious from "../../hooks/usePrevious";
import { apiCallDate, displayDate } from "../../utils";

import {
  getPayouts,
  resetPayouts,
  getPayoutsTransactions
} from "../../redux/payouts/action";

const PAGE_SIZE = 20;

const toOptionMap = (options, key, value) => {
  const res = {};
  options.forEach(option => {
    res[option[key]] = option[value];
  });
  return res;
};

export default function Payouts({ mid }) {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [toDate, setToDate] = useState();
  const [payouts, setPayouts] = useState();
  const [source, setSource] = useState("0");
  const [product, setProduct] = useState(0);
  const [fromDate, setFromDate] = useState();
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [pageReset, setPageReset] = useState(true);
  const [morePages, setMorePages] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [businessIds, setBusinessIds] = useState([]);
  const [paymentType, setPaymentType] = useState("0");
  const [sortBy, setSortBy] = useState("payoutDate:asc");
  const [filteredColumns, setFilteredColumns] = useState();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [payoutsTransaction, setPayoutsTransaction] = useState();
  const [showPayoutAmountModal, setShowPayoutAmountModal] = useState(false);

  const generateFilters = useCallback(() => {
    return [
      {
        key: "searchText",
        name: "Showing results for",
        value: searchText,
        set: setSearchText,
        default: ""
      },
      {
        key: "product",
        name: "Product",
        value: product,
        set: setProduct,
        default: 0
      },
      {
        key: "fromDate",
        name: "From Date",
        value: fromDate ? displayDate(fromDate) : "",
        set: setFromDate,
        default: 0
      },
      {
        key: "toDate",
        name: "To Date",
        value: toDate ? displayDate(toDate) : "",
        set: setToDate,
        default: 0
      },
      {
        key: "source",
        name: "Source",
        value: source,
        set: setSource,
        default: "0"
      },
      {
        key: "sortBy",
        name: "Sorting By",
        value: sortBy,
        splitter: ":",
        isSort: true,
        set: setSortBy,
        default: "payoutDate:asc",
        options: toOptionMap(payoutsColumns(intl), "dataKey", "name")
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, product, sortBy, searchText, fromDate, toDate, payoutsColumns]);

  const filters = useFilters(generateFilters);
  const prevPage = usePrevious(currentPage);
  const allPayouts = useSelector(state => state.payouts.payouts);
  const allPayoutsTransaction = useSelector(
    state => state.payouts.payout_transaction
  );

  const productOptions = [
    {
      id: 2,
      name: intl.formatMessage({ defaultMessage: "POS" })
    }
  ];

  const sourceOptions = [
    {
      id: "0",
      name: intl.formatMessage({ defaultMessage: "All Statuses" })
    },
    {
      id: "1",
      name: intl.formatMessage({ defaultMessage: "Paid" })
    },
    {
      id: "2",
      name: intl.formatMessage({ defaultMessage: "Pending" })
    }
  ];

  const paymentTypes = [
    {
      id: "0",
      name: intl.formatMessage({ defaultMessage: "Check" })
    },
    {
      id: "1",
      name: intl.formatMessage({ defaultMessage: "Bank transfer" })
    },
    {
      id: "2",
      name: intl.formatMessage({ defaultMessage: "Wire" })
    }
  ];

  useEffect(() => {
    dispatch(getPayoutsTransactions({}));
    return () => {
      dispatch(resetPayouts());
      setPayouts(undefined);
      setPayoutsTransaction(undefined);
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(allPayouts && allPayouts.length === PAGE_SIZE);
    if (payouts || (allPayouts && allPayouts.length !== 0)) {
      setPayouts(
        pageReset
          ? [...(allPayouts || [])]
          : [...(payouts || []), ...allPayouts]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPayouts]);

  useEffect(() => {
    setMorePages(
      allPayoutsTransaction && allPayoutsTransaction.length === PAGE_SIZE
    );
    if (
      payoutsTransaction ||
      (allPayoutsTransaction && allPayoutsTransaction.length !== 0)
    ) {
      setPayoutsTransaction(
        pageReset
          ? [...(allPayoutsTransaction || [])]
          : [...(payoutsTransaction || []), ...allPayoutsTransaction]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPayoutsTransaction]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchpayouts = async () => {
      if (
        !(
          currentPage !== prevPage &&
          prevPage !== undefined &&
          currentPage === 0
        )
      ) {
        try {
          if (currentPage !== prevPage ? currentPage : 0) {
            setLoading(true);
          } else {
            setInitLoad(true);
          }

          setPageReset(currentPage === prevPage);

          await dispatch(
            getPayouts({
              sort: sortBy,
              search: searchText,
              fromDate: apiCallDate(fromDate),
              toDate: apiCallDate(toDate),
              pageNumber: currentPage !== prevPage ? currentPage : 0,
              pageSize: PAGE_SIZE
            })
          );
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchpayouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, searchText, fromDate, toDate, dispatch]);

  useEffect(() => {
    if (mid) {
      setFilteredColumns([
        "payoutDate",
        "transactionDateRange",
        "settlementAccountNumber",
        "totalNumberOfTransaction",
        "totalTransactionAmount",
        "monthlyFee",
        "commission",
        "disputeAmount",
        "totalRefundTransaction",
        "refundTransactionAmount",
        "setupFee",
        "securityDeposit",
        "transferFee",
        "payoutAmount",
        "invoiceType",
        "status",
        "gateway",
        "pastRecoveryFees",
        "action"
      ]);
    } else {
      setFilteredColumns([
        "payoutDate",
        "transactionDateRange",
        "businessName",
        "businessId",
        "settlementAccountNumber",
        "totalNumberOfTransaction",
        "totalTransactionAmount",
        "monthlyFee",
        "commission",
        "disputeAmount",
        "totalRefundTransaction",
        "refundTransactionAmount",
        "setupFee",
        "securityDeposit",
        "transferFee",
        "payoutAmount",
        "invoiceType",
        "status",
        "gateway",
        "pastRecoveryFees",
        "action"
      ]);
    }
  }, [mid]);

  const handleFromDateChange = date => {
    setFromDate(date);
    if (Date.parse(date) > Date.parse(toDate)) {
      setToDate("");
    }
  };

  const handleToDateChange = date => {
    setToDate(date);
  };

  const downloadExcel = () => {
    console.log("download excel");
  };

  const handleDeleteRow = businessId => {
    console.log(businessId);
  };

  const handleSaveRow = businessId => {
    console.log(businessId);
  };

  const handleEditRow = businessId => {
    setBusinessIds([...businessIds, businessId]);
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector} ${direction}`);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortBy(`${sortColumn}:${sortType}`);
  };

  return (
    <PayoutsComp
      mid={mid}
      source={source}
      toDate={toDate}
      payouts={payouts}
      loading={loading}
      product={product}
      filters={filters}
      fromDate={fromDate}
      setSource={setSource}
      setProduct={setProduct}
      handleSort={handleSort}
      searchText={searchText}
      businessIds={businessIds}
      paymentType={paymentType}
      paymentTypes={paymentTypes}
      downloadExcel={downloadExcel}
      setSearchText={setSearchText}
      sourceOptions={sourceOptions}
      handleEditRow={handleEditRow}
      handleSaveRow={handleSaveRow}
      productOptions={productOptions}
      setPaymentType={setPaymentType}
      handleNextPage={handleNextPage}
      handleDeleteRow={handleDeleteRow}
      showStatusModal={showStatusModal}
      filteredColumns={filteredColumns}
      pageLoading={!payouts && initLoad}
      payoutsTransaction={payoutsTransaction}
      setShowStatusModal={setShowStatusModal}
      handleToDateChange={handleToDateChange}
      handleFromDateChange={handleFromDateChange}
      showPayoutAmountModal={showPayoutAmountModal}
      setShowPayoutAmountModal={setShowPayoutAmountModal}
      sortColumn={sortBy.split(":")?.[0]}
      sortType={sortBy.split(":")?.[1]}
      handleSortColumn={handleSortColumn}
    />
  );
}
