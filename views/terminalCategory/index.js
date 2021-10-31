import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

import TerminalCategoryComp from "../../components/terminalCategory";

import {
  getTerminals,
  resetTerminals,
  updatePasscode,
  changeStatus
} from "../../redux/terminals/action";

import useMessage from "../../hooks/useMessage";
import usePrevious from "../../hooks/usePrevious";

const REQUIRED_COLUMNS = [
  "terminalId",
  "serialNumber",
  // "type",
  "primaryIMEI",
  "secondaryIMEI",
  "assignedToBusiness"
];

const PAGE_SIZE = 20;

export default function TerminalCategory({ path }) {
  const history = useHistory();
  const intl = useIntl();
  const dispatch = useDispatch();
  const message = useMessage();

  const STATUS_MAP = {
    assigned: 1,
    damaged: 5,
    lost: 12,
    blocked: 3,
    returned: 8
  };

  const { title, columns } = {
    assigned: {
      title: intl.formatMessage({ defaultMessage: "Assigned Device" }),
      columns: [
        ...REQUIRED_COLUMNS,
        "assignedDate",
        "activationDate",
        "partnerName",
        "deviceStatusName",
        "action",
        "refresh"
      ]
    },
    damaged: {
      title: intl.formatMessage({ defaultMessage: "Damaged Device" }),
      columns: [
        "tid",
        "serialNumber",
        "primaryIMEI",
        "secondaryIMEI",
        "assignedToBusiness",
        "damagedOn",
        "reasonDamaged",
        "action"
      ]
    },
    lost: {
      title: intl.formatMessage({ defaultMessage: "Lost Device" }),
      columns: [
        "tid",
        "serialNumber",
        "primaryIMEI",
        "secondaryIMEI",
        // "assignedToBusiness",
        "lostOn",
        "supportingDoc",
        "action"
      ]
    },
    blocked: {
      title: intl.formatMessage({ defaultMessage: "Blocked Device" }),
      columns: [...REQUIRED_COLUMNS, "blockedOn", "reasonBlocking", "action"]
    }
  }[path.split("/")[2]];

  let timer;

  const [merchantModalVisible, setMerchantModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [passcodeModalVisible, setPasscodeModalVisible] = useState(false);
  const [activeTerminal, setActiveTerminal] = useState();
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [morePages, setMorePages] = useState(false);
  const [pageReset, setPageReset] = useState(true);
  const [sortBy, setSortBy] = useState("date:asc");
  const [terminals, setTerminals] = useState();
  const [merchant, setMerchant] = useState();
  const [supportingDocVisible, setSupportingDocVisible] = useState();

  const prevPage = usePrevious(currentPage);

  const allTerminals = useSelector(
    state => state.terminals[STATUS_MAP[path.split("/")[2]]]
  );

  useEffect(() => {
    return () => {
      dispatch(resetTerminals());
      setTerminals(undefined);
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              pageSize: PAGE_SIZE,
              type: STATUS_MAP[path.split("/")[2]],
              merchant: merchant?.value
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
  }, [currentPage, sortBy, searchText, dispatch, path, merchant]);

  const handleBack = () => {
    history.goBack();
  };

  const handleMerchantClick = row => {
    setMerchantModalVisible(true);
    setActiveTerminal(row);

    timer = setTimeout(() => {
      setMerchantModalVisible(false);
    }, 60 * 1000);
  };

  const closeMerchantModal = () => {
    setMerchantModalVisible(false);
  };

  const handleSort = (dataKey, direction) => {
    setSortBy(`${dataKey}:${direction}`);
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  const handleSearchMerchant = merchant => {
    setMerchant(merchant);
  };

  const handleRefresh = () => {
    console.log("refreshed");
  };

  const openPasscodeModal = row => {
    setActiveTerminal(row);
    setPasscodeModalVisible(true);
  };

  const openStatusModal = row => {
    setActiveTerminal(row);
    setStatusModalVisible(true);
  };

  const closePasscodeModal = () => {
    setActiveTerminal(undefined);
    setPasscodeModalVisible(false);
  };

  const closeStatusModal = () => {
    setActiveTerminal(undefined);
    setStatusModalVisible(false);
  };

  const handlePasscodeChange = data => {
    dispatch(updatePasscode(data))
      .then(() => {
        message.success(
          <FormattedMessage defaultMessage="Passcode change successfully" />
        );
      })
      .catch(err => {
        message.error(err?.data?.message);
      })
      .finally(() => {
        closePasscodeModal();
      });
  };

  const handleStatusChange = data => {
    dispatch(changeStatus(data))
      .then(() => {
        message.success(
          <FormattedMessage defaultMessage="Device Status updated successfully" />
        );
        setLoading(true);
        setMerchant(undefined);
        setPageReset(true);
        setSearchText("");
        dispatch(
          getTerminals({
            sort: "date:asc",
            search: "",
            pageNumber: 0,
            pageSize: PAGE_SIZE,
            type: STATUS_MAP[path.split("/")[2]],
            merchant: ""
          })
        ).finally(() => {
          setLoading(false);
        });
      })
      .catch(err => {
        message.error(err?.data?.message);
      })
      .finally(() => {
        closeStatusModal();
      });
  };

  return (
    <TerminalCategoryComp
      title={title}
      path={path}
      displayColumns={[...columns]}
      data={terminals}
      handleBack={handleBack}
      merchantModalVisible={merchantModalVisible}
      handleMerchantClick={handleMerchantClick}
      closeMerchantModal={closeMerchantModal}
      pageLoading={!terminals && initLoad}
      searchText={searchText}
      handleSort={handleSort}
      handleRefresh={handleRefresh}
      handleNextPage={handleNextPage}
      handleSearch={handleSearch}
      handleSearchMerchant={handleSearchMerchant}
      initLoad={initLoad}
      loading={loading}
      sortBy={sortBy}
      passcodeModalVisible={passcodeModalVisible}
      statusModalVisible={statusModalVisible}
      openPasscodeModal={openPasscodeModal}
      openStatusModal={openStatusModal}
      closePasscodeModal={closePasscodeModal}
      closeStatusModal={closeStatusModal}
      activeTerminal={activeTerminal}
      handlePasscodeChange={handlePasscodeChange}
      handleStatusChange={handleStatusChange}
      supportingDocVisible={supportingDocVisible}
      setSupportingDocVisible={setSupportingDocVisible}
    />
  );
}
