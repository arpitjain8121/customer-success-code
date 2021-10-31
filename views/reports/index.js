import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";

import ReportsComp from "../../components/reports";
import { getTransactions, resetTransactions } from "../../redux/reports/action";
import usePrevious from "../../hooks/usePrevious";

const PAGE_SIZE = 20;

function Reports() {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [pageReset, setPageReset] = useState(true);

  const [transactions, setTransactions] = useState();
  const [sortBy, setSortBy] = useState("transactionDate");
  const [searchText, setSearchText] = useState("");
  const [credit, setCredit] = useState(true);
  const [debit, setDebit] = useState(true);
  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [transaction, setTransaction] = useState("");
  const [partner, setPartner] = useState([
    {
      value: "0",
      label: formatMessage({ defaultMessage: "All Partners" })
    }
  ]);

  const prevPage = usePrevious(currentPage);

  const allTransactions = useSelector(state => state.reports.transactions);

  const btnsList = [
    {
      text: formatMessage({ defaultMessage: "Settled" }),
      value: "0"
    },
    {
      text: formatMessage({ defaultMessage: "Refunds" }),
      value: "1"
    },
    {
      text: formatMessage({ defaultMessage: "Unsuccessful" }),
      value: "2"
    }
  ];

  const products = [
    {
      key: "0",
      value: formatMessage({ defaultMessage: "All Products" })
    },
    {
      key: "1",
      value: formatMessage({ defaultMessage: "POS" })
    },
    {
      key: "2",
      value: formatMessage({ defaultMessage: "ECOM" })
    }
  ];

  const dates = [
    {
      key: "0",
      value: formatMessage({ defaultMessage: "Today" })
    },
    {
      key: "1",
      value: formatMessage({ defaultMessage: "Yesterday" })
    },
    {
      key: "2",
      value: formatMessage({ defaultMessage: "Last 7 days" })
    },
    {
      key: "3",
      value: formatMessage({ defaultMessage: "Last 30 Days" })
    },
    {
      key: "4",
      value: formatMessage({ defaultMessage: "Last 90 Days" })
    },
    {
      key: "5",
      value: formatMessage({ defaultMessage: "Last 1 Year" })
    },
    {
      key: "6",
      value: formatMessage({ defaultMessage: "Select Date Range" })
    }
  ];

  const partners = [
    {
      value: "0",
      label: formatMessage({ defaultMessage: "All Partners" })
    },
    {
      value: "1",
      label: formatMessage({ defaultMessage: "Partner1" })
    },
    {
      value: "2",
      label: formatMessage({ defaultMessage: "Partner2" })
    },
    {
      value: "3",
      label: formatMessage({ defaultMessage: "Partner3" })
    },
    {
      value: "4",
      label: formatMessage({ defaultMessage: "Partner4" })
    },
    {
      value: "5",
      label: formatMessage({ defaultMessage: "Partner5" })
    }
  ];

  const sources = [
    {
      key: "0",
      value: formatMessage({ defaultMessage: "Ali Pay" })
    },
    {
      key: "1",
      value: formatMessage({ defaultMessage: "Cash Payment" })
    },
    {
      key: "2",
      value: formatMessage({ defaultMessage: "e-button" })
    }
  ];

  const transactionList = [
    {
      key: "0",
      value: formatMessage({ defaultMessage: "All Txns" })
    },
    {
      key: "1",
      value: formatMessage({ defaultMessage: "Setteled Txns" })
    },
    {
      key: "2",
      value: formatMessage({ defaultMessage: "Unsetteled Txns" })
    }
  ];

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
          } else {
            setInitLoad(true);
          }

          setPageReset(currentPage === prevPage);

          await dispatch(
            getTransactions({
              sort: sortBy,
              search: searchText,
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

    fetchTransactions();
  }, [currentPage, sortBy, searchText, dispatch]);

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector} ${direction}`);
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  const handleProductChange = e => {
    setProduct(e.target.value);
  };

  const handleDateChange = e => {
    setDate(e.target.value);
  };

  const handlePartnerChange = value => {
    setPartner(value);
  };

  const handleSourceChange = e => {
    setSource(e.target.value);
  };
  const handleTransactionChange = e => {
    setTransaction(e.target.value);
  };

  const handleDownloadExcel = () => {
    console.log("download excel");
  };

  return (
    <ReportsComp
      pageLoading={!transactions && initLoad}
      loading={loading}
      initLoad={initLoad}
      transactions={transactions}
      handleNextPage={handleNextPage}
      handleSearch={handleSearch}
      handleSort={handleSort}
      btnsList={btnsList}
      products={products}
      product={product}
      handleProductChange={handleProductChange}
      dates={dates}
      date={date}
      handleDateChange={handleDateChange}
      partners={partners}
      partner={partner}
      handlePartnerChange={handlePartnerChange}
      sources={sources}
      source={source}
      handleSourceChange={handleSourceChange}
      transactionList={transactionList}
      transaction={transaction}
      handleTransactionChange={handleTransactionChange}
      credit={credit}
      setCredit={setCredit}
      debit={debit}
      setDebit={setDebit}
      handleDownloadExcel={handleDownloadExcel}
    />
  );
}

export default Reports;
