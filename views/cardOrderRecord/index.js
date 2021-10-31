import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import usePrevious from "../../hooks/usePrevious";
import OrderRecordComp from "../../components/cardOrderRecord";
import { getOrderCardRecord, resetCards } from "../../redux/cards/action";

const EMPLOYEE_TABLE_PAGE_SIZE = 20;

export default function CardOrderRecord({ location, match }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [cardsRecord, setCardsRecord] = useState();
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [noData, setNoData] = useState(false);
  const [morePages, setMorePages] = useState(false);
  const [pageReset, setPageReset] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("employeeID:asc");

  const prevPage = usePrevious(currentPage);

  const allCardsRecord = useSelector(state => state.cards.cardRecords);

  useEffect(() => {
    return () => {
      dispatch(resetCards());
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(
      allCardsRecord && allCardsRecord.length === EMPLOYEE_TABLE_PAGE_SIZE
    );

    if (!cardsRecord && (!allCardsRecord || allCardsRecord.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setCardsRecord(
        pageReset
          ? [...(allCardsRecord || [])]
          : [...(cardsRecord || []), ...(allCardsRecord || [])]
      );
    }
  }, [allCardsRecord]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchCardsRecord = async () => {
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
            getOrderCardRecord({
              uid: match?.params?.id,
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

    fetchCardsRecord();
  }, [currentPage, sortBy, dispatch]);

  const handleBack = () => {
    history.goBack();
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
    <OrderRecordComp
      initLoad={initLoad}
      loading={loading}
      refNo={location?.state?.refNo}
      date={location?.state?.date}
      count={location?.state?.count}
      handleBack={handleBack}
      cardsRecord={cardsRecord}
      handleSort={handleSort}
      handleNextPage={handleNextPage}
      noData={noData}
    />
  );
}
