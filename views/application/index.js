import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import ApplicationComp from "components/application";
import {
  getApplications,
  resetApplications,
  getApplicationStatus
} from "redux/applications/action";
import { mergeArrayObjects, getRoute } from "utils.js";
import { ReactComponent as posIcon } from "../../images/pos.svg";
import CONSTANTS from "constants.js";

const {
  ROUTES: { APPLICATION_DETAILS }
} = CONSTANTS;

const color = {
  0: { icon: posIcon, tint: "#09ab69" },
  1: { icon: posIcon, tint: "#6918c7" },
  2: { icon: posIcon, tint: "#f4a100" },
  3: { icon: posIcon, tint: "#dc392e" },
  4: { icon: posIcon, tint: "#dc392e" },
  5: { icon: posIcon, tint: "#f4a100" },
  6: { icon: posIcon, tint: "#09ab69" },
  7: { icon: posIcon, tint: "#dc392e" },
  18: { icon: posIcon, tint: "#09ab69" },
  20: { icon: posIcon, tint: "#f4a100" }
};

export default function Application() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState(1);
  const [toDate, setToDate] = useState();
  const [fromDate, setFromDate] = useState();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [applicationStatus, setApplicationStatus] = useState();
  const [newBusinessModalVisible, setNewBusinessModalVisible] = useState(false);
  const [redirect, setRedirect] = useState();

  const allApplications = useSelector(state => state.applications.applications);
  const allApplicationStatus = useSelector(
    state => state.applications.application_status
  );

  useEffect(() => {
    dispatch(getApplicationStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetApplications());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        await dispatch(
          getApplications({
            search: searchText,
            fromDate,
            toDate
          })
        );
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, fromDate, toDate, searchText]);

  useEffect(() => {
    if (allApplicationStatus) {
      setApplicationStatus(mergeArrayObjects(allApplicationStatus, color));
    }
  }, [allApplicationStatus]);

  const handleSearch = text => {
    setSearchText(text);
  };

  const handleTabClick = to => {
    setTab(to);
  };

  const handleFromDateChange = date => {
    setFromDate(date);
    if (Date.parse(date) > Date.parse(toDate)) {
      setToDate("");
    }
  };

  const handleToDateChange = date => {
    setToDate(date);
  };

  const handleNewBusiness = num => {
    setNewBusinessModalVisible(false);
    setRedirect(num);
  };

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: getRoute(APPLICATION_DETAILS, { id: "new" }),
          state: { phone: redirect }
        }}
      />
    );
  }

  return (
    <ApplicationComp
      tab={tab}
      toDate={toDate}
      loading={loading}
      fromDate={fromDate}
      searchText={searchText}
      handleSearch={handleSearch}
      handleTabClick={handleTabClick}
      allApplications={allApplications}
      applicationStatus={applicationStatus}
      handleToDateChange={handleToDateChange}
      handleFromDateChange={handleFromDateChange}
      newBusinessModalVisible={newBusinessModalVisible}
      setNewBusinessModalVisible={setNewBusinessModalVisible}
      handleNewBusiness={handleNewBusiness}
      color={color}
    />
  );
}
