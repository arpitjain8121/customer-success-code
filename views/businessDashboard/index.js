import React from "react";
import { useSelector } from "react-redux";
import {
  getInactiveMerchants,
  resetInactiveMerchants,
  getChargeBacks,
  resetChargeBacks,
  getExpiringDocuments,
  resetExpiringDocuments,
  getTopTenMerchants,
  resetTopTenMerchants
} from "../../redux/dashboard/action";

import BusinessDashboardComp from "../../components/businessDashboard";
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
    title: "Approval Pending",
    stat: 2129,
    to: "#",
    tint: "#09ab69"
  },
  {
    icon: posIcon,
    title: "Activation Pending",
    stat: 1998,
    to: ASSIGNED_TERMINALS,
    tint: "#6918c7"
  },
  {
    icon: posIcon,
    title: "Pending with NSDL",
    stat: 22,
    to: DAMAGED_TERMINALS,
    tint: "#f4a100"
  },
  {
    icon: posIcon,
    title: "Pending with Hitachi",
    stat: 21,
    to: LOST_TERMINALS,
    tint: "#dc392e"
  },
  {
    icon: posIcon,
    title: "Deliver to Merchants",
    stat: 21,
    to: BLOCKED_TERMINALS,
    tint: "#dc392e"
  },
  {
    icon: posIcon,
    title: "Total Transactions",
    stat: 21,
    to: BLOCKED_TERMINALS,
    tint: "#dc392e"
  },
  {
    icon: posIcon,
    title: "Total Volume INR",
    stat: 21,
    to: BLOCKED_TERMINALS,
    tint: "#dc392e"
  }
];

export default function BusinessDashboard() {
  const allChargeBacks = useSelector(state => state.dashboard.chargeBacks);
  const allInactiveMerchants = useSelector(
    state => state.dashboard.inactiveMerchants
  );
  const allExpiringDocuments = useSelector(
    state => state.dashboard.expiringDocuments
  );
  const allTopTenMerchants = useSelector(
    state => state.dashboard.topTenMerchants
  );

  return (
    <BusinessDashboardComp
      stats={STATS}
      pageLoading={!STATS}
      allChargeBacks={allChargeBacks}
      getChargeBacks={getChargeBacks}
      resetChargeBacks={resetChargeBacks}
      getTopTenMerchants={getTopTenMerchants}
      allTopTenMerchants={allTopTenMerchants}
      allExpiringDocuments={allExpiringDocuments}
      allInactiveMerchants={allInactiveMerchants}
      getExpiringDocuments={getExpiringDocuments}
      getInactiveMerchants={getInactiveMerchants}
      resetTopTenMerchants={resetTopTenMerchants}
      resetInactiveMerchants={resetInactiveMerchants}
      resetExpiringDocuments={resetExpiringDocuments}
    />
  );
}
