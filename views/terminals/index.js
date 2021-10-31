import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  getTerminals,
  resetTerminals,
  getAssignedTerminal
} from "../../redux/terminals/action";
import TerminalsComp from "../../components/terminals";
import { isAlphaNumeric, isNumeric } from "../../utils";
import usePrevious from "../../hooks/usePrevious";
import useMessage from "../../hooks/useMessage";
import { ReactComponent as posIcon } from "../../images/pos.svg";

import CONSTANTS from "../../constants";

const {
  ROUTES: {
    ASSIGNED_TERMINALS,
    DAMAGED_TERMINALS,
    LOST_TERMINALS,
    BLOCKED_TERMINALS
  }
} = CONSTANTS;

const STATS = [
  {
    icon: posIcon,
    title: "Available",
    stat: 2129,
    to: "#",
    tint: "#09ab69"
  },
  {
    icon: posIcon,
    title: "Assigned",
    stat: 1998,
    to: ASSIGNED_TERMINALS,
    tint: "#6918c7"
  },
  {
    icon: posIcon,
    title: "Damaged",
    stat: 22,
    to: DAMAGED_TERMINALS,
    tint: "#f4a100"
  },
  {
    icon: posIcon,
    title: "Lost",
    stat: 21,
    to: LOST_TERMINALS,
    tint: "#dc392e"
  },
  {
    icon: posIcon,
    title: "Blocked",
    stat: 21,
    to: BLOCKED_TERMINALS,
    tint: "#dc392e"
  }
];

const PAGE_SIZE = 20;

export default function Terminals() {
  const dispatch = useDispatch();
  const message = useMessage();

  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState([]);
  const [filteredTerminals, setFilteredTerminals] = useState([]);
  const [assignDeviceModalVisible, setAssignDeviceModalVisible] = useState(
    false
  );
  const [selectedMerchant, setSelectedMerchant] = useState();
  const [comment, setComment] = useState();
  const [selectedDevDetails, setSelectedDevDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [morePages, setMorePages] = useState(false);
  const [pageReset, setPageReset] = useState(true);
  const [sortBy, setSortBy] = useState("inventoryDate");
  const [terminals, setTerminals] = useState();
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  const prevPage = usePrevious(currentPage);

  const allTerminals = useSelector(state => state.terminals.terminals);

  useEffect(() => {
    return () => {
      dispatch(resetTerminals());
      setTerminals(undefined);
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(allTerminals && allTerminals.length === PAGE_SIZE);

    if (terminals || (allTerminals && allTerminals.length !== 0)) {
      setTerminals(
        pageReset
          ? [...(allTerminals || [])]
          : [...(terminals || []), ...allTerminals]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTerminals]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchTerminals = async () => {
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
            getTerminals({
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

    fetchTerminals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, searchText, dispatch]);

  useEffect(() => {
    const selectedSerialNumbers = selectedDevice.map(row => row.serialNumber);
    setFilteredTerminals([
      ...selectedDevice,
      ...(terminals || []).filter(
        row => !selectedSerialNumbers.includes(row.serialNumber)
      )
    ]);
  }, [terminals, selectedDevice, dispatch]);

  const handleSelectedRowChange = ({ selectedRows }) => {
    setSelectedDevice(selectedRows);
  };

  const handleAssign = (selectedMerchant, comment) => {
    dispatch(
      getAssignedTerminal({
        businessId: selectedMerchant?.uid,
        comments: comment,
        terminalDetails: selectedDevice.map(({ uid }) => ({
          deviceInventoryId: uid,
          deviceName: selectedDevDetails[uid].deviceName,
          activationCode: Number(selectedDevDetails[uid].activationCode)
        }))
      })
    )
      .then(() => {
        message.success(
          <FormattedMessage defaultMessage="Device was assigned successfully" />
        );
        dispatch(
          getTerminals({
            sort: "inventoryDate",
            search: "",
            pageNumber: 0,
            pageSize: PAGE_SIZE
          })
        );
        setSelectedDevice([]);
        setSelectedDevDetails([]);
        setComment(undefined);
        setSelectedMerchant(undefined);
        setPageReset(true);
        setClearSelectedRows(!clearSelectedRows);
      })
      .catch(err => {
        message.error(err?.data?.message);
      })
      .finally(() => {
        setAssignDeviceModalVisible(false);
      });
  };

  const handleChangeDeviceFields = (name, value, uid) => {
    setSelectedDevDetails({
      ...selectedDevDetails,
      [uid]: {
        ...selectedDevDetails[uid],
        [name]: value
      }
    });
  };

  const handleBlurDeviceFields = (name, uid) => {
    let err = {};

    if (name === "activationCode") {
      if (
        selectedDevDetails[uid]?.activationCode &&
        !isNumeric.test(selectedDevDetails[uid]?.activationCode)
      ) {
        err = { activationCode: "Numbers only" };
      } else if (selectedDevDetails[uid]?.activationCode?.length !== 6) {
        err = { activationCode: "6 digits needed" };
      } else {
        err = { activationCode: undefined };
      }
    } else if (name === "deviceName") {
      if (
        selectedDevDetails[uid]?.deviceName &&
        !isAlphaNumeric.test(selectedDevDetails[uid]?.deviceName)
      ) {
        err = { deviceName: "Alphanumeric only" };
      } else {
        err = { deviceName: undefined };
      }
    }

    setErrors({
      ...errors,
      [uid]: {
        ...errors[uid],
        ...err
      }
    });
  };

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

  return (
    <TerminalsComp
      pageLoading={!terminals && initLoad}
      stats={STATS}
      loading={loading}
      terminals={filteredTerminals}
      handleSort={handleSort}
      handleNextPage={handleNextPage}
      handleSearch={handleSearch}
      initLoad={initLoad}
      selectedDevice={selectedDevice}
      handleAssign={handleAssign}
      toggleAssignDeviceVisible={() =>
        setAssignDeviceModalVisible(!assignDeviceModalVisible)
      }
      assignDeviceModalVisible={assignDeviceModalVisible}
      handleSelectedRowChange={handleSelectedRowChange}
      //assignDeviceModal Props
      selectedMerchant={selectedMerchant}
      setSelectedMerchant={setSelectedMerchant}
      selectedDevDetails={selectedDevDetails}
      comment={comment}
      setComment={setComment}
      handleChangeDeviceFields={handleChangeDeviceFields}
      errors={errors}
      handleBlurDeviceFields={handleBlurDeviceFields}
      clearSelectedRows={clearSelectedRows}
    />
  );
}
