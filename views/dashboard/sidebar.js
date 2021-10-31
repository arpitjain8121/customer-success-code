import { FormattedMessage } from "react-intl";

import { ReactComponent as HomeIcon } from "../../images/home.svg";
import { ReactComponent as PayrollIcon } from "../../images/payroll.svg";
import { ReactComponent as POSIcon } from "../../images/pos.svg";
import { ReactComponent as EcomIcon } from "../../images/ecom.svg";
import { ReactComponent as InvoiceIcon } from "../../images/invoices.svg";

const sidebar = [
  {
    name: <FormattedMessage defaultMessage="Dashboard" />,
    image: HomeIcon,
    permission: "dashboard",
    id: "dashboard"
  },
  {
    name: <FormattedMessage defaultMessage="Businesses" />,
    image: PayrollIcon,
    permission: "organization",
    id: "organization"
  },
  {
    name: <FormattedMessage defaultMessage="Applications" />,
    image: PayrollIcon,
    permission: "applications",
    id: "applications"
  },
  // {
  //   name: <FormattedMessage defaultMessage="Terminal Inventory" />,
  //   image: EcomIcon,
  //   permission: "terminal_device",
  //   id: "terminal_device"
  // },
  // {
  //   name: <FormattedMessage defaultMessage="Reports" />,
  //   image: InvoiceIcon,
  //   id: "reports",
  //   submenu: [
  //     {
  //       name: <FormattedMessage defaultMessage="Payouts" />,
  //       image: EcomIcon,
  //       permission: "payouts",
  //       id: "payouts"
  //     }
  //   ]
  // },
  {
    name: <FormattedMessage defaultMessage="Transactions" />,
    image: EcomIcon,
    permission: "transaction",
    id: "transaction"
  }
  // {
  //   name: <FormattedMessage defaultMessage="Services" />,
  //   image: EcomIcon,
  //   permission: "services",
  //   id: "services"
  // },
  // {
  //   name: <FormattedMessage defaultMessage="Create Staff" />,
  //   image: EcomIcon,
  //   permission: "staff",
  //   id: "staff"
  // },
  // {
  //   name: <FormattedMessage defaultMessage="Discount" />,
  //   image: EcomIcon,
  //   permission: "discount",
  //   id: "discount"
  // },
  // {
  //   name: <FormattedMessage defaultMessage="Approvals" />,
  //   image: EcomIcon,
  //   id: "approvals",
  //   submenu: [
  //     {
  //       name: <FormattedMessage defaultMessage="KYC Approval" />,
  //       image: POSIcon,
  //       permission: "kycApproval",
  //       id: "kycApproval"
  //     },
  //     {
  //       name: <FormattedMessage defaultMessage="Final Approval" />,
  //       image: POSIcon,
  //       permission: "sAdminApproval",
  //       id: "sAdminApproval"
  //     }
  //   ]
  // },
  // {
  //   name: <FormattedMessage defaultMessage="Audit Report" />,
  //   image: EcomIcon,
  //   permission: "audit",
  //   id: "audit"
  // }
];

export default sidebar;
