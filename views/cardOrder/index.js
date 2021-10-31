import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import usePrevious from "../../hooks/usePrevious";
import useMessage from "../../hooks/useMessage";
import OrderNowComp from "../../components/cardOrder";
import {
  getOrderCard,
  getStatus,
  getOrderCardMessage,
  resetCards
} from "../../redux/cards/action";
import { getDepartments } from "../../redux/departments/action";
import { getWalletBalance, postAddMoney } from "../../redux/myAccount/action";

const CARD_TABLE_PAGE_SIZE = 20;

export default function OrderNow({}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const message = useMessage();

  const [ordercards, setOrderCards] = useState();
  const [department, setDepartment] = useState(0);
  const [cardStatus, setCardStatus] = useState(0);
  const [sortBy, setSortBy] = useState("employeeID:asc");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [noData, setNoData] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [totalPrice, settotalPrice] = useState(0);
  const [pageReset, setPageReset] = useState(true);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [remainingBal, setRemainingBal] = useState();

  const [selectedRows, setSelectedRows] = useState([]);

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [money, setMoney] = useState();
  const [moneyError, setMoneyError] = useState("");
  const [enableAddMoneyBtn, setEnableAddMoneyBtn] = useState(false);
  const [moneySubmitLoader, setMoneySubmitLoader] = useState(false);

  const prevPage = usePrevious(currentPage);

  const allDepartments = useSelector(state => state.departments.departments);
  const allOrderCards = useSelector(state => state.cards.orderNowCards);
  const allCardStatus = useSelector(state => state.cards.cardStatus);
  const walletBalance = useSelector(state => state.myAccount.walletBalance);

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getStatus());
    dispatch(getWalletBalance());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCards());
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(
      allOrderCards && allOrderCards.length === CARD_TABLE_PAGE_SIZE
    );

    if (!ordercards && (!allOrderCards || allOrderCards.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setOrderCards(
        pageReset
          ? [...(allOrderCards || [])]
          : [...(ordercards || []), ...(allOrderCards || [])]
      );
    }
  }, [allOrderCards]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchOrderCards = async () => {
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
            getOrderCard({
              departmentId: department,
              sort: sortBy,
              cardStatus: cardStatus,
              search: searchText,
              pageNumber: currentPage !== prevPage ? currentPage : 0,
              pageSize: CARD_TABLE_PAGE_SIZE
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

    fetchOrderCards();
  }, [department, currentPage, cardStatus, sortBy, searchText, dispatch]);

  const handleBack = () => {
    history.goBack();
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
  };
  const handleDepartmentChange = e => {
    setDepartment(e.target.value);
  };
  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector}:${direction}`);
  };

  const handleStatusChange = e => {
    setCardStatus(e.target.value);
  };

  const cardSelectedRowChange = e => {
    let totalValue = 0;
    setSelectedEmployees(e.selectedRows);

    if (e.selectedRows.length > 0) {
      setDisabled(false);
      e.selectedRows.map(item => {
        totalValue += parseInt(item.price);
      });

      if (totalValue > walletBalance.balance) {
        setShowAddBtn(true);
        setRemainingBal(totalValue - walletBalance.balance);
      } else {
        setShowAddBtn(false);
      }
      settotalPrice(totalValue);
    } else {
      setDisabled(true);
      settotalPrice(0);
      setShowAddBtn(false);
    }
  };
  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

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

  const handleOrderNow = () => {
    const data = {};
    selectedEmployees.forEach(item => {
      data[item.orderType] = [...(data[item.orderType] || []), item.uid];
    });
    dispatch(
      getOrderCardMessage({
        orderWpsCards: data.New,
        replacementWpsCards: data.Replacement
      })
    )
      .then(result => {
        message.success(result.payload.message);
        dispatch(
          getOrderCard({
            departmentId: department,
            sort: sortBy,
            cardStatus: cardStatus,
            search: searchText,
            pageNumber: 0,
            pageSize: CARD_TABLE_PAGE_SIZE
          })
        );
      })
      .catch(err => {
        message.error(err?.data?.message);
      });
  };

  return (
    <OrderNowComp
      initLoad={initLoad}
      loading={loading}
      ordercards={ordercards}
      noData={noData}
      handleSort={handleSort}
      handleBack={handleBack}
      handleSearch={handleSearch}
      handleDepartmentChange={handleDepartmentChange}
      handleNextPage={handleNextPage}
      allDepartments={allDepartments}
      allCardStatus={allCardStatus}
      department={department}
      cardStatus={cardStatus}
      cardSelectedRowChange={cardSelectedRowChange}
      disabled={disabled}
      totalPrice={totalPrice}
      handleStatusChange={handleStatusChange}
      walletBalance={walletBalance}
      showAddBtn={showAddBtn}
      remainingBal={remainingBal}
      handleAddMoney={handleAddMoney}
      handleCloseAddMoneyModal={handleCloseAddMoneyModal}
      showAddMoneyModal={showAddMoneyModal}
      handleChangeMoney={handleChangeMoney}
      handleSubmitMoney={handleSubmitMoney}
      enableAddMoneyBtn={enableAddMoneyBtn}
      money={money}
      moneyError={moneyError}
      moneySubmitLoader={moneySubmitLoader}
      handleOrderNow={handleOrderNow}
      selectedEmployees={selectedRows}
    />
  );
}
