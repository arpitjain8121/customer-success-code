import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getRoute } from "../../utils";
import CONSTANTS from "../../constants";
import usePrevious from "../../hooks/usePrevious";
import { getSAdminApproval, resetLists } from "../../redux/business/action";
import SAdminApprovalComp from "../../components/sAdminApproval";

const {
  ROUTES: { MERCHANT }
} = CONSTANTS;

const PAGE_SIZE = 20;

export default function SAdminApproval() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [kycApprove, setkycApprove] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [noData, setNoData] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);

  const [pageReset, setPageReset] = useState();

  const prevPage = usePrevious(currentPage);

  const allKycApproval = useSelector(state => state.business.kycAppr);

  useEffect(() => {
    setMorePages(allKycApproval && allKycApproval.length === PAGE_SIZE);

    if (!kycApprove && (!allKycApproval || allKycApproval.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setkycApprove(
        pageReset
          ? [...(allKycApproval || [])]
          : [...(kycApprove || []), ...(allKycApproval || [])]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allKycApproval]);

  useEffect(() => {
    return () => {
      dispatch(resetLists());
    };
  }, [dispatch]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchSAdminApproval = async () => {
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
          await dispatch(getSAdminApproval());
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchSAdminApproval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sortBy]);

  const handleBusinessClick = (businessId, name) => {
    history.push({
      pathname: getRoute(MERCHANT, { id: businessId }),
      state: { name, locationKey: true }
    });
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector}:${direction}`);
  };

  return (
    <SAdminApprovalComp
      initLoad={initLoad}
      loading={loading}
      noData={noData}
      handleSort={handleSort}
      data={kycApprove}
      handleBusinessClick={handleBusinessClick}
    />
  );
}
