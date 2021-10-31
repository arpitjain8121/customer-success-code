import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CONSTANTS from "../../constants";
import { getRoute } from "../../utils";
import usePrevious from "../../hooks/usePrevious";
import OrderHistoryComp from "../../components/cardOrderHistory";
import { getOrderCardHistory, resetCards } from "../../redux/cards/action";

const {
  ROUTES: { ORDER_RECORD_CARD }
} = CONSTANTS;
const EMPLOYEE_TABLE_PAGE_SIZE = 20;

export default function OrderHistory() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [cardsHistory, setCardsHistory] = useState();
  const [searchText, setSearchText] = useState("");
  const [pageReset, setPageReset] = useState(true);
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [sortBy, setSortBy] = useState("referenceNumber:asc");

  const prevPage = usePrevious(currentPage);
  const allCardsHistory = useSelector(state => state.cards.cardsHistory);

  useEffect(() => {
    return () => {
      dispatch(resetCards());
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(
      allCardsHistory && allCardsHistory.length === EMPLOYEE_TABLE_PAGE_SIZE
    );

    if (!cardsHistory && (!allCardsHistory || allCardsHistory.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setCardsHistory(
        pageReset
          ? [...(allCardsHistory || [])]
          : [...(cardsHistory || []), ...(allCardsHistory || [])]
      );
    }
  }, [allCardsHistory]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchCardsHistory = async () => {
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
            getOrderCardHistory({
              search: searchText,
              sort: sortBy,
              pageNumber: currentPage !== prevPage ? currentPage : 0,
              pageSize: EMPLOYEE_TABLE_PAGE_SIZE
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

    fetchCardsHistory();
  }, [currentPage, sortBy, searchText, dispatch]);

  const handleBack = () => {
    history.goBack();
  };
  const handleSearch = searchText => {
    setSearchText(searchText);
  };

  const handleViewClick = ({ uid, referenceNumber, orderOn, count }) => {
    history.push({
      pathname: getRoute(ORDER_RECORD_CARD, { id: uid }),
      state: { refNo: referenceNumber, date: orderOn, count: count }
    });
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector}:${direction}`);
  };
  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  return (
    <OrderHistoryComp
      initLoad={initLoad}
      loading={loading}
      noData={noData}
      cardsHistory={cardsHistory}
      handleBack={handleBack}
      handleSearch={handleSearch}
      handleViewClick={handleViewClick}
      handleSort={handleSort}
      handleNextPage={handleNextPage}
    />
  );
}
