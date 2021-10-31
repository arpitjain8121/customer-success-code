import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import usePrevious from "../../hooks/usePrevious";
import { getMerchantDevice } from "../../redux/business/action";
import MerchantDevicesComp from "../../components/merchantDevices";

const PAGE_SIZE = 20;

export default function MerchantDevices() {
  const dispatch = useDispatch();

  const [devices, setDevices] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [noData, setNoData] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);

  const [pageReset, setPageReset] = useState();

  const prevPage = usePrevious(currentPage);

  const allMerchantDevice = useSelector(state => state.business.device);

  useEffect(() => {
    setMorePages(allMerchantDevice && allMerchantDevice.length === PAGE_SIZE);

    if (!devices && (!allMerchantDevice || allMerchantDevice.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setDevices(
        pageReset
          ? [...(allMerchantDevice || [])]
          : [...(devices || []), ...(allMerchantDevice || [])]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMerchantDevice]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchMerchantDevices = async () => {
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
          await dispatch(getMerchantDevice());
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchMerchantDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, deviceStatus, dispatch]);

  const handleStatusChange = e => {
    setDeviceStatus(e.target.value);
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector}:${direction}`);
  };

  return (
    <MerchantDevicesComp
      initLoad={initLoad}
      loading={loading}
      noData={noData}
      handleSearch={handleSearch}
      handleSort={handleSort}
      handleStatusChange={handleStatusChange}
      data={devices}
      searchText={searchText}
    />
  );
}
