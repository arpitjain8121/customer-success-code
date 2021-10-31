import Terminals from "../terminals";
import TerminalCategory from "../terminalCategory";
import Transactions from "../transactions";
import BusinessListing from "../businessListing";
import BusinessProfile from "../merchant";
import Payouts from "../payouts";
import Approvals from "../approvals";
import ApprovalDetail from "../approvalDetail";
import SAdminApproval from "../sAdminApproval";
import Application from "../application";
import ApplicationDetails from "../applicationDetails";
import BusinessDashboard from "../businessDashboard";

import CONSTANTS from "../../constants";

const {
  ROUTES: {
    TERMINALS,
    ASSIGNED_TERMINALS,
    DAMAGED_TERMINALS,
    LOST_TERMINALS,
    BLOCKED_TERMINALS,
    RETURNED_TERMINALS,
    DASHBOARD,
    BUSINESS,
    MERCHANT,
    APPLICATIONS,
    APPLICATION_DETAILS,
    REPORTS,
    SERVICES,
    STAFF,
    DISCOUNT,
    APPROVALS,
    APPROVALS_DETAILS,
    AUDIT,
    TRANSACTIONS,
    S_ADMIN_APPROVAL
  },
  ACCESS_MAPPING: {
    // PROCESS,
    // CREATE,
    VIEW
    // EDIT
    // DELETE
  }
} = CONSTANTS;

function permission(module, action) {
  return { permission: `${module}:${action}` };
}

const routes = [
  {
    ...permission("dashboard", VIEW),
    path: DASHBOARD,
    exact: true,
    component: BusinessDashboard
  },
  {
    ...permission("organization", VIEW),
    path: MERCHANT,
    exact: true,
    component: BusinessProfile
  },
  {
    ...permission("organization", VIEW),
    path: BUSINESS,
    exact: true,
    component: BusinessListing
  },
  {
    ...permission("sAdminApproval", VIEW),
    path: S_ADMIN_APPROVAL,
    exact: true,
    component: SAdminApproval
  },
  {
    ...permission("kycApproval", VIEW),
    path: APPROVALS_DETAILS,
    exact: true,
    component: ApprovalDetail
  },
  {
    ...permission("kycApproval", VIEW),
    path: APPROVALS,
    exact: true,
    component: Approvals
  },
  {
    ...permission("terminal_device", VIEW),
    path: ASSIGNED_TERMINALS,
    exact: true,
    component: TerminalCategory
  },
  {
    ...permission("terminal_device", VIEW),
    path: DAMAGED_TERMINALS,
    exact: true,
    component: TerminalCategory
  },
  {
    ...permission("terminal_device", VIEW),
    path: LOST_TERMINALS,
    exact: true,
    component: TerminalCategory
  },
  {
    ...permission("terminal_device", VIEW),
    path: BLOCKED_TERMINALS,
    exact: true,
    component: TerminalCategory
  },
  {
    ...permission("terminal_device", VIEW),
    path: RETURNED_TERMINALS,
    exact: true,
    component: TerminalCategory
  },
  {
    ...permission("terminal_device", VIEW),
    path: TERMINALS,
    exact: true,
    component: Terminals
  },
  {
    ...permission("transaction", VIEW),
    path: TRANSACTIONS,
    exact: true,
    component: Transactions
  },
  {
    ...permission("payouts", VIEW),
    path: REPORTS,
    exact: true,
    component: Payouts
  },
  {
    ...permission("services", VIEW),
    path: SERVICES,
    exact: true,
    component: () => <div>Services</div>
  },
  {
    ...permission("staff", VIEW),
    path: STAFF,
    exact: true,
    component: () => <div>Staff</div>
  },
  {
    ...permission("discount", VIEW),
    path: DISCOUNT,
    exact: true,
    component: () => <div>Discount</div>
  },
  {
    ...permission("applications", VIEW),
    path: APPLICATION_DETAILS,
    exact: true,
    component: ApplicationDetails
  },
  {
    ...permission("applications", VIEW),
    path: APPLICATIONS,
    exact: true,
    component: Application
  },
  {
    ...permission("audit", VIEW),
    path: AUDIT,
    exact: true,
    component: () => <div>Audit</div>
  }
];

export default routes;
