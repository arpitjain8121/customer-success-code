import React, { useEffect, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";

import usePrevious from "../../hooks/usePrevious";
import MyAccountComp from "../../components/myAccount";
import {
  getTransactionDetails,
  getWalletBalance,
  postAddMoney,
  submitAddMoney
} from "../../redux/myAccount/action";
import { getDateFormat } from "../../utils";

export const PermissionContext = createContext({});
const TRANSACTION_TABLE_PAGE_SIZE = 20;

export default function MyAccount({ modulePermission }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [initLoad, setInitLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageReset, setPageReset] = useState(true);

  const [sort, setSortBy] = useState("Date:asc");
  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState("0");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [money, setMoney] = useState();
  const [moneyError, setMoneyError] = useState("");
  const [enableAddMoneyBtn, setEnableAddMoneyBtn] = useState(false);
  const [moneySubmitLoader, setMoneySubmitLoader] = useState(false);

  const transactionTypeArray = [
    formatMessage({ defaultMessage: "ALL" }),
    formatMessage({ defaultMessage: "CREDIT" }),
    formatMessage({ defaultMessage: "DEBIT" })
  ];

  const prevPage = usePrevious(currentPage);

  const walletBalance = useSelector(state => state.myAccount.walletBalance);
  const allTransaction = useSelector(state => state.myAccount.transactions);
  const transactionsStatus = useSelector(
    state => state.myAccount.transactionsStatus
  );

  useEffect(() => {
    dispatch(getWalletBalance());
  }, [pageReset]);

  useEffect(() => {
    setMorePages(
      allTransaction && allTransaction.length === TRANSACTION_TABLE_PAGE_SIZE
    );

    if (!transaction && (!allTransaction || allTransaction.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setTransaction(
        pageReset
          ? [...(allTransaction || [])]
          : [...(transaction || []), ...allTransaction]
      );
    }
  }, [allTransaction]);

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

          const data = {
            sort,
            pageNumber: currentPage,
            pageSize: TRANSACTION_TABLE_PAGE_SIZE,
            search,
            transactionType,
            fromDate,
            toDate
          };

          await dispatch(getTransactionDetails(data));
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchTransactions();
  }, [currentPage, sort, transactionType, search, fromDate, toDate, dispatch]);

  // useEffect(() => {
  //   if (transactionsStatus) {
  //     const {
  //       action,
  //       gatewayId,
  //       secretId,
  //       referenceId,
  //       amount,
  //       currency,
  //       mode,
  //       description,
  //       returnUrl,
  //       name,
  //       address,
  //       city,
  //       state,
  //       postalCode,
  //       country,
  //       phone,
  //       email,
  //       serverUrl
  //     } = transactionsStatus;

  //     const data = {
  //       action,
  //       gatewayId,
  //       secretId,
  //       referenceId,
  //       amount,
  //       currency,
  //       mode,
  //       description,
  //       returnUrl,
  //       name,
  //       address,
  //       city,
  //       state,
  //       postalCode,
  //       country,
  //       phone,
  //       email,
  //       serverUrl
  //     };

  //     dispatch(submitAddMoney(data));
  //   }
  // }, transactionsStatus);

  const handleBack = () => {
    history.goBack();
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector}:${direction}`);
  };

  const handleSubmitSearch = text => {
    setSearch(text);
  };

  const handleFromDateChange = e => {
    const updatedDateFormat = getDateFormat(e.target.value);
    setFromDate(updatedDateFormat);
  };

  const handleToDateChange = e => {
    const updatedDateFormat = getDateFormat(e.target.value);
    setToDate(updatedDateFormat);
  };

  const handleTransactionTypeChange = e => {
    setTransactionType(e.target.value);
  };

  const handleExport = () => {};

  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };

  const handleCloseAddMoneyModal = () => {
    setShowAddMoneyModal(false);
  };

  const handleChangeMoney = e => {
    const updatedValue = e.target.value.replace(/^0+/, "");
    setMoney(updatedValue);

    if (updatedValue.length >= 1) {
      if (!isNaN(updatedValue)) {
        setEnableAddMoneyBtn(true);
        setMoneyError("");
      } else {
        setEnableAddMoneyBtn(false);
        setMoneyError(
          formatMessage({
            defaultMessage: "Only Numeric Values Allowed"
          })
        );
      }
    } else {
      setEnableAddMoneyBtn(false);
    }
  };

  const handleSubmitMoney = async () => {
    try {
      setMoneySubmitLoader(true);
      await dispatch(postAddMoney(money));
      setMoneySubmitLoader(false);
    } catch (err) {
      throw err;
    }
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  return (
    <PermissionContext.Provider value={modulePermission}>
      <MyAccountComp
        pageLoading={!transaction && initLoad}
        initLoad={initLoad}
        loading={loading}
        walletBalance={walletBalance}
        transaction={transaction}
        noData={noData}
        handleBack={handleBack}
        handleNextPage={handleNextPage}
        handleSort={handleSort}
        handleSubmitSearch={handleSubmitSearch}
        fromDate={fromDate}
        toDate={toDate}
        handleFromDateChange={handleFromDateChange}
        handleToDateChange={handleToDateChange}
        transactionTypeArray={transactionTypeArray}
        transactionType={transactionType}
        handleTransactionTypeChange={handleTransactionTypeChange}
        handleExport={handleExport}
        handleAddMoney={handleAddMoney}
        showAddMoneyModal={showAddMoneyModal}
        handleCloseAddMoneyModal={handleCloseAddMoneyModal}
        money={money}
        moneyError={moneyError}
        moneySubmitLoader={moneySubmitLoader}
        enableAddMoneyBtn={enableAddMoneyBtn}
        handleChangeMoney={handleChangeMoney}
        handleSubmitMoney={handleSubmitMoney}
      />
    </PermissionContext.Provider>
  );
}
