import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getRoute } from "../../utils";
import CONSTANTS from "../../constants";
import usePrevious from "../../hooks/usePrevious";
import { getBusinessList, resetLists } from "../../redux/business/action";
import BusinessListingComp from "../../components/businessListing";
import { apiCallDate } from "../../utils";

const {
  ROUTES: { MERCHANT }
} = CONSTANTS;

const PAGE_SIZE = 20;

export default function BusinessListing() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [list, setList] = useState();

  const [loading, setLoading] = useState(false);
  const [initLoad, setInitLoad] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [businessListStatus, setBusinessListStatus] = useState();
  const [partner, setPartner] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageReset, setPageReset] = useState(true);
  const [sortBy, setSortBy] = useState("name:asc");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const prevPage = usePrevious(currentPage);

  const allBusinessList = useSelector(state => state.business.lists);

  useEffect(() => {
    return () => {
      dispatch(resetLists());
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(allBusinessList && allBusinessList.length === PAGE_SIZE);

    if (!list && (!allBusinessList || allBusinessList.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setList(
        pageReset
          ? [...(allBusinessList || [])]
          : [...(list || []), ...(allBusinessList || [])]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBusinessList]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchListing = async () => {
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
            getBusinessList({
              partner: partner ? partner.value : undefined,
              sort: sortBy,
              search: searchText,
              pageNumber: currentPage !== prevPage ? currentPage : 0,
              pageSize: PAGE_SIZE,
              fromDate: fromDate
                ? apiCallDate(fromDate, "mm-dd-yyyy")
                : undefined,
              toDate: toDate ? apiCallDate(toDate, "mm-dd-yyyy") : undefined
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

    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, searchText, dispatch, partner, fromDate, toDate]);

  const handlePartnerChange = e => {
    setPartner(e.target.value);
  };

  const handleStatusChange = e => {
    setBusinessListStatus(e.target.value);
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
  };

  const handleSearchPartner = partner => {
    setPartner(partner);
  };

  const handleFromDateChange = date => {
    setFromDate(date);
    if (!date) {
      setToDate("");
    }
  };

  const handleToDateChange = date => {
    setToDate(date);
  };

  const handleBusinessClick = (businessId, name) => {
    history.push({
      pathname: getRoute(MERCHANT, { id: businessId }),
      state: { name }
    });
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortBy(`${sortColumn}:${sortType}`);
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  return (
    <BusinessListingComp
      pageLoading={!list && initLoad}
      loading={loading}
      initLoad={initLoad}
      handleSearch={handleSearch}
      handleStatusChange={handleStatusChange}
      handlePartnerChange={handlePartnerChange}
      data={list}
      noData={noData}
      handleSearchPartner={handleSearchPartner}
      handleBusinessClick={handleBusinessClick}
      fromDate={fromDate}
      toDate={toDate}
      handleNextPage={handleNextPage}
      handleFromDateChange={handleFromDateChange}
      handleToDateChange={handleToDateChange}
      handleSortColumn={handleSortColumn}
      sortColumn={sortBy.split(":")?.[0]}
      sortType={sortBy.split(":")?.[1]}
      businessListStatus={businessListStatus}
    />
  );
}
