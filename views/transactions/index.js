import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";

import { years, apiCallDate } from "../../utils";
import usePrevious from "../../hooks/usePrevious";
import { useFilters } from "components/common";
import columns from "components/transactions/columns";
import TransactionsComp from "components/transactions";
import {
  sendPdf,
  resetTransactions,
  getSettledTransactions,
  getRefundsTransactions,
  getUnsucessfullTransactions
} from "redux/transactions/action";

import { getSources, getProducts, getPartners } from "redux/util/action";

const PAGE_SIZE = 20;

const toOptionMap = (options, key, value) => {
  const res = {};
  options.forEach(option => {
    res[option[key]] = option[value];
  });
  return res;
};

export default function Transactions({ mid, className }) {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [pageReset, setPageReset] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [filteredColumns, setFilteredColumns] = useState();

  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [debit, setDebit] = useState(true);
  const [credit, setCredit] = useState(true);
  // const [product, setProduct] = useState(0);

  const [refundData, setRefundData] = useState();
  const [source, setSource] = useState({
    value: "0",
    label: intl.formatMessage({ defaultMessage: "All" })
  });
  const [activeTab, setActiveTab] = useState("0");
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState();
  const [partnerOptions, setPartnerOptions] = useState([
    {
      value: "0",
      label: intl.formatMessage({ defaultMessage: "All Partners" })
    }
  ]);

  const [sortBy, setSortBy] = useState("transactionDate:asc");
  const [date, setDate] = useState({
    value: 2,
    label: intl.formatMessage({ defaultMessage: "Last 7 Days" })
  });
  const [partner, setPartner] = useState([
    {
      value: "0",
      label: intl.formatMessage({ defaultMessage: "All Partners" })
    }
  ]);

  const dates = [
    {
      value: "0",
      label: intl.formatMessage({ defaultMessage: "Today" })
    },
    {
      value: "1",
      label: intl.formatMessage({ defaultMessage: "Yesterday" })
    },
    {
      value: "2",
      label: intl.formatMessage({ defaultMessage: "Last 7 Days" })
    },
    {
      value: "3",
      label: intl.formatMessage({ defaultMessage: "Last 30 Days" })
    },
    {
      value: "4",
      label: intl.formatMessage({ defaultMessage: "Last 90 Days" })
    },
    {
      value: "5",
      label: intl.formatMessage({ defaultMessage: "Last 1 Year" }),
      extra: "Email only"
    },
    {
      value: "6",
      label: intl.formatMessage({ defaultMessage: "Custom Range" })
    }
  ];

  const prevPage = usePrevious(currentPage);

  const allTransactions = useSelector(state => state.transactions.transactions);
  const allPartners = useSelector(state => state.utils.partners);
  const allSources = useSelector(state => state.utils.sources);

  const generateFilters = useCallback(() => {
    return [
      {
        key: "searchText",
        name: "Showing results for",
        value: searchText,
        set: setSearchText,
        default: ""
      },
      // {
      //   key: "product",
      //   name: "Product",
      //   value: product,
      //   set: setProduct,
      //   default: 0,
      // },
      {
        key: "date",
        name: "Date",
        value: date.label,
        set: setDate,
        default: {
          value: 2,
          label: intl.formatMessage({ defaultMessage: "Last 7 Days" })
        }
      },
      {
        key: "source",
        name: "Source",
        value: source.label,
        set: setSource,
        default: {
          value: "0",
          label: intl.formatMessage({ defaultMessage: "All" })
        }
      },
      {
        key: "partner",
        name: "Partner",
        value: partner.map(({ label }) => label).join(", "),
        set: setPartner,
        reset: [
          {
            value: "0",
            label: intl.formatMessage({ defaultMessage: "All Partners" })
          }
        ],
        default: intl.formatMessage({ defaultMessage: "All Partners" })
      },
      {
        key: "sortBy",
        name: "Sorting By",
        value: sortBy,
        splitter: ":",
        isSort: true,
        set: setSortBy,
        default: "transactionDate:asc",
        options: toOptionMap(columns(intl), "dataKey", "name")
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, partner, sortBy, searchText, date, columns]);

  const filters = useFilters(generateFilters);

  // const selectedProducts = useSelector(
  //   state => state.business.selectedProducts
  // );
  // const productOptions = () => {
  //   if (selectedProducts.length !== 1) {
  //     return [
  //       {
  //         id: 0,
  //         name: intl.formatMessage({ defaultMessage: "All Products" })
  //       },
  //       ...selectedProducts.map(({ id, name }) => ({
  //         id,
  //         name
  //       }))
  //     ];
  //   }
  // };

  const getTabs = mid => {
    if (mid) {
      return [
        {
          text: intl.formatMessage({ defaultMessage: "Settled" }),
          value: "0"
        },
        {
          text: intl.formatMessage({ defaultMessage: "Unsuccessful" }),
          value: "2"
        }
      ];
    } else {
      return [
        {
          text: intl.formatMessage({ defaultMessage: "Settled" }),
          value: "0"
        },
        {
          text: intl.formatMessage({ defaultMessage: "Refunds" }),
          value: "1"
        },
        {
          text: intl.formatMessage({ defaultMessage: "Unsuccessful" }),
          value: "2"
        }
      ];
    }
  };

  useEffect(() => {
    dispatch(getSources());
    dispatch(getProducts());
    dispatch(getPartners());
  }, [dispatch]);

  useEffect(() => {
    if (allPartners) {
      setPartnerOptions([
        ...partnerOptions,
        ...allPartners.map(item => ({ value: item.id, label: item.name }))
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPartners]);

  useEffect(() => {
    return () => {
      dispatch(resetTransactions());
      setTransactions(undefined);
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(allTransactions && allTransactions.length === PAGE_SIZE);

    if (transactions || (allTransactions && allTransactions.length !== 0)) {
      setTransactions(
        pageReset
          ? [...(allTransactions || [])]
          : [...(transactions || []), ...allTransactions]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTransactions]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchTransactions = async () => {
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
          }
          setPageReset(currentPage === prevPage);

          const data = {
            source: source ? source.value : undefined,
            product: 2,
            sort: sortBy,
            search: searchText,
            pageSize: PAGE_SIZE,
            partner: [...partner.map(({ value }) => value)],
            toDate: apiCallDate(Date.now()),
            fromDate: apiCallDate(Date.now() - years(366)),
            paymentGatewayTypeId:
              credit && !debit ? 2 : debit && !credit ? 1 : 0,
            pageNumber: currentPage !== prevPage ? currentPage : 0
          };

          let hitApi = getSettledTransactions;
          if (activeTab === "0") {
            hitApi = getSettledTransactions;
          } else if (activeTab === "1") {
            hitApi = getRefundsTransactions;
          } else if (activeTab === "2") {
            hitApi = getUnsucessfullTransactions;
          }

          let startDate = apiCallDate(Date.now() - years(7 / 366));
          let endDate = apiCallDate(Date.now());

          if (date.value === "5") {
            dispatch(sendPdf(data));
            setDate({
              value: 2,
              label: intl.formatMessage({ defaultMessage: "Last 7 days" })
            });
          } else if (date.value === "6") {
            setFromDate("");
            setToDate("");
            setShowModal(true);
          } else if (date.value === "7") {
            startDate = apiCallDate(fromDate);
            endDate = apiCallDate(toDate);
            dispatch(hitApi({ ...data, fromDate: startDate, toDate: endDate }));
          } else {
            if (date.value === "0") {
              startDate = Date.now();
            } else if (date.value === "1") {
              startDate = Date.now() - years(1 / 366);
            } else if (date.value === "2") {
              startDate = Date.now() - years(7 / 366);
            } else if (date.value === "3") {
              startDate = Date.now() - years(30 / 366);
            } else if (date.value === "4") {
              startDate = Date.now() - years(90 / 366);
            }
            await dispatch(
              hitApi({
                ...data,
                fromDate: apiCallDate(startDate),
                toDate: apiCallDate(endDate)
              })
            );
          }
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    date,
    sortBy,
    source,
    partner,
    activeTab,
    searchText,
    currentPage,
    credit,
    debit,
    columns,
    dispatch
  ]);

  useEffect(() => {
    setSearchText("");
    setSource({
      value: "0",
      label: intl.formatMessage({ defaultMessage: "All Sources" })
    });

    setDate({
      value: 2,
      label: intl.formatMessage({ defaultMessage: "Last 7 Days" })
    });
    setPartner([
      {
        value: "0",
        label: intl.formatMessage({ defaultMessage: "All Partners" })
      }
    ]);

    if (mid) {
      if (activeTab === "0") {
        setFilteredColumns([
          "action",
          "amount",
          "authCode",
          "cardNumber",
          "cardType",
          "fee",
          "gateway",
          "merchantName",
          "mid",
          "netAmount",
          "orderId",
          "partner",
          "qpayConfirmationId",
          "settlementAccountNumber",
          "settlementDateTime",
          "source",
          "superMerchantId",
          "superMerchantName",
          "transactionRefId",
          "transactionTime"
        ]);
      } else if (activeTab === "2") {
        setFilteredColumns([
          "address",
          "amount",
          "cardHolderName",
          "cardNumber",
          "city",
          "country",
          "email",
          "errorCode",
          "errorDetails",
          "invoiceNumber",
          "ipAddress",
          "merchantName",
          "merchantUrl",
          "mid",
          "partner",
          "phone",
          "reason",
          "source",
          "transactionRefId",
          "transactionTime"
        ]);
      }
    } else {
      if (activeTab === "0") {
        setFilteredColumns([
          "transactionTime",
          "settlementDateTime",
          "mid",
          "settlementAccountNumber",
          "merchantName",
          "cardNumber",
          "cardType",
          "authCode",
          "transactionRefId",
          "qpayConfirmationId",
          "orderId",
          "amount",
          "fee",
          "netAmount",
          "source",
          "action",
          "partner",
          "superMerchantName",
          "superMerchantId",
          "gateway"
        ]);
      } else if (activeTab === "1") {
        setFilteredColumns([
          "transactionTime",
          "settlementDateTime",
          "mid",
          "settlementAccountNumber",
          "merchantName",
          "cardNumber",
          "cardType",
          "authCode",
          "transactionRefId",
          "qpayConfirmationId",
          "orderId",
          "amount",
          "fee",
          "netAmount",
          "source",
          "action",
          "partner",
          "superMerchantName",
          "superMerchantId",
          "gateway"
        ]);
      } else if (activeTab === "2") {
        setFilteredColumns([
          "transactionTime",
          "merchantName",
          "mid",
          "cardNumber",
          "amount",
          "errorCode",
          "errorDetails",
          "reason",
          "transactionRefId",
          "merchantUrl",
          "ipAddress",
          "cardHolderName",
          "address",
          "city",
          "country",
          "phone",
          "email",
          "source",
          "partner",
          "invoiceNumber"
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const downloadExcel = () => {};

  const handlePartnerChange = value => {
    if (value && !value.length) {
      setPartner([partnerOptions[0]]);
    } else if (value[0].value === "0") {
      setPartner(value.slice(1));
    } else if (
      value.some(val => val.value === "0") ||
      value.length === partnerOptions.length - 1
    ) {
      setPartner([partnerOptions[0]]);
    } else {
      setPartner(value);
    }
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortBy(`${sortColumn}:${sortType}`);
  };

  const handleChangeFromDate = date => {
    setFromDate(date);
    let myFutureDate = new Date(toDate);
    myFutureDate.setDate(myFutureDate.getDate() - 90);
    if (
      Date.parse(date) > Date.parse(toDate) ||
      Date.parse(myFutureDate) > Date.parse(date)
    ) {
      setToDate("");
    }
  };

  const handleToDateChange = date => {
    setToDate(date);
  };
  return (
    <TransactionsComp
      mid={mid}
      date={date}
      dates={dates}
      debit={debit}
      credit={credit}
      source={source}
      toDate={toDate}
      partner={partner}
      filters={filters}
      loading={loading}
      setDate={setDate}
      fromDate={fromDate}
      setDebit={setDebit}
      tabs={getTabs(mid)}
      className={className}
      showModal={showModal}
      setSource={setSource}
      setCredit={setCredit}
      handleBack={handleBack}
      searchText={searchText}
      setFromDate={setFromDate}
      sourceOptions={allSources}
      transactions={transactions}
      setShowModal={setShowModal}
      setActiveTab={setActiveTab}
      setSearchText={setSearchText}
      downloadExcel={downloadExcel}
      handleNextPage={handleNextPage}
      partnerOptions={partnerOptions}
      setPartner={handlePartnerChange}
      filteredColumns={filteredColumns}
      sortType={sortBy.split(":")?.[1]}
      handleSortColumn={handleSortColumn}
      sortColumn={sortBy.split(":")?.[0]}
      pageLoading={!transactions && initLoad}
      handleChangeFromDate={handleChangeFromDate}
      handleToDateChange={handleToDateChange}
      setRefundData={setRefundData}
      refundData={refundData}
      // product={product}
      // setProduct={setProduct}
      // productOptions={productOptions}
    />
  );
}
