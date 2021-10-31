import React, { useEffect, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";

import usePrevious from "../../hooks/usePrevious";
import CardsComp from "../../components/cardTotalCards";
import { getCards } from "../../redux/cards/action";

export const PermissionContext = createContext({});
const CARD_TABLE_PAGE_SIZE = 20;

export default function CardTotal({ modulePermission }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [initLoad, setInitLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageReset, setPageReset] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("0");
  const [accountType, setAccountType] = useState("0");
  const [sort, setSortBy] = useState("employeeID:asc");

  const statusArray = [
    formatMessage({ defaultMessage: "ALL" }),
    formatMessage({ defaultMessage: "INACTIVE" }),
    formatMessage({ defaultMessage: "ACTIVE" }),
    formatMessage({ defaultMessage: "DORMANT" })
  ];

  const accountTypeArray = [
    formatMessage({ defaultMessage: "ALL" }),
    formatMessage({ defaultMessage: "IBAN" }),
    formatMessage({ defaultMessage: "WPS" })
  ];

  const prevPage = usePrevious(currentPage);
  const allCards = useSelector(state => state.cards.cards);

  useEffect(() => {
    setMorePages(allCards && allCards.length === CARD_TABLE_PAGE_SIZE);

    if (!cards && (!allCards || allCards.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setCards(
        pageReset
          ? [...(allCards || [])]
          : [...(cards || []), ...(allCards || [])]
      );
    }
  }, [allCards]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchCards = async () => {
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
            search,
            status,
            accountType,
            pageNumber: currentPage,
            pageSize: CARD_TABLE_PAGE_SIZE,
            sort
          };

          await dispatch(getCards(data));
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchCards();
  }, [search, status, accountType, currentPage, sort, dispatch]);

  const handleBack = () => {
    history.goBack();
  };

  const handleSubmitSearch = async text => {
    setSearch(text);
  };

  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  const handleAccontTypeChange = e => {
    setAccountType(e.target.value);
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
    <PermissionContext.Provider value={modulePermission}>
      <CardsComp
        pageLoading={!cards && initLoad}
        initLoad={initLoad}
        loading={loading}
        handleBack={handleBack}
        cards={cards}
        noData={noData}
        handleSort={handleSort}
        handleNextPage={handleNextPage}
        handleSubmitSearch={handleSubmitSearch}
        statusArray={statusArray}
        status={status}
        handleStatusChange={handleStatusChange}
        accountTypeArray={accountTypeArray}
        accountType={accountType}
        handleAccontTypeChange={handleAccontTypeChange}
      />
    </PermissionContext.Provider>
  );
}
