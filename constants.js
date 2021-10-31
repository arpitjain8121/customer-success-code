import { createIntl, createIntlCache } from "react-intl";

import approved from "./images/approved.svg";
import expired from "./images/expired.svg";
import inGrace from "./images/in_grace.svg";
import pending from "./images/pending.svg";
import rejected from "./images/rejected.svg";

const cache = createIntlCache();

const intl = createIntl(
  // way for getting access to intl object outside react
  {
    locale: "en"
  },
  cache
);

const CONSTANTS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  LOCALE: "locale",
  DEFAULT_LOCALE: "en",
  BASE_API_URL:
    process.env.REACT_APP_ENDPOINT || "https://qa-bluebox-gateway.qpayi.com",
  ROUTES: {
    LANDING_PAGE: "/welcome",
    REDIR: "/login",
    AUTH: "/auth",
    LOGIN: "/auth/login",
    // authentication required

    DASHBOARD: "/dashboard",
    BUSINESS: "/business",
    MERCHANT: "/business/:id",
    APPLICATIONS: "/applications",
    APPLICATION_DETAILS: "/applications/:id",
    TERMINALS: "/terminals",
    ASSIGNED_TERMINALS: "/terminals/assigned",
    DAMAGED_TERMINALS: "/terminals/damaged",
    LOST_TERMINALS: "/terminals/lost",
    BLOCKED_TERMINALS: "/terminals/blocked",
    RETURNED_TERMINALS: "/terminals/returned",
    REPORTS: "/reports",
    SERVICES: "/services",
    STAFF: "/staff",
    DISCOUNT: "/discount",
    S_ADMIN_APPROVAL: "/super-admin-approval",
    APPROVALS: "/approvals",
    APPROVALS_DETAILS: "/approvals/:id",
    AUDIT: "/audit",
    TRANSACTIONS: "/transactions"
  },
  PRODUCTS: {
    POS: 2,
    ECOM: 4,
    EBILLING: 5,
    PAYROLL: 6
  },
  KYC_STATUSES: {
    PENDING: 1,
    REJECTED: 2,
    APPROVED: 3,
    EXPIRED: 4,
    MISSING: 5,
    IN_GRACE: 6
  },
  KYC_STATUS_ICONS: {
    3: {
      text: intl.formatMessage({
        defaultMessage: "Approved"
      }),
      icon: approved
    },
    4: {
      text: intl.formatMessage({
        defaultMessage: "Expired"
      }),
      icon: expired
    },
    6: {
      text: intl.formatMessage({
        defaultMessage: "In Grace"
      }),
      icon: inGrace
    },
    5: {
      text: intl.formatMessage({
        defaultMessage: "Missing"
      }),
      icon: pending
    },
    1: {
      text: intl.formatMessage({
        defaultMessage: "Pending"
      }),
      icon: pending
    },
    2: {
      text: intl.formatMessage({
        defaultMessage: "Rejected"
      }),
      icon: rejected
    }
  },
  ACCESS_MAPPING: {
    PROCESS: 1,
    CREATE: 2,
    VIEW: 4,
    EDIT: 8,
    DELETE: 16
  }
};

export default CONSTANTS;
