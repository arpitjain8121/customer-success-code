import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

import MerchantComp from "components/merchant";

import Documents from "../dataDocument";
import Profile from "../merchantProfile";
import Contracts from "../contracts";
import Transactions from "../transactions";
// import Devices from "../merchantDevices";
// import Payouts from "../payouts";
// import Invoices from "../invoiceDetails";

function Merchant({ match }) {
  const [activeTab, setActiveTab] = useState(0);

  const history = useHistory();

  const businessName = useSelector(state => state.business.profile?.name);

  const panes = [
    {
      title: <FormattedMessage defaultMessage="Profile" />,
      content: <Profile mid={match?.params?.id} hideEdit />
    },
    {
      title: <FormattedMessage defaultMessage="Documents" />,
      content: <Documents mid={match?.params?.id} hideEdit />
    },
    {
      title: <FormattedMessage defaultMessage="Contract" />,
      content: <Contracts mid={match?.params?.id} hideEdit />
    },
    {
      title: <FormattedMessage defaultMessage="Transactions" />,
      content: <Transactions className="mt-4" mid={match?.params?.id} />
    }
    // {
    //   title: <FormattedMessage defaultMessage="Payouts" />,
    //   content: <Payouts mid={match?.params?.id} />
    // },
    // {
    //   title: <FormattedMessage defaultMessage="Devices" />,
    //   content: <Devices mid={match?.params?.id} />
    // },
    // {
    //   title: <FormattedMessage defaultMessage="Invoices" />,
    //   content: <Invoices mid={match?.params?.id} />
    // },
    // {
    //   title: <FormattedMessage defaultMessage="Users" />,
    //   content: <div>Users</div>
    // }
  ];

  return (
    <MerchantComp
      merchantName={businessName ?? history.location?.state?.name}
      mid={match?.params?.id}
      panes={panes}
      activeTab={activeTab}
      handleBack={history.goBack}
      handleTabChange={tab => setActiveTab(tab)}
    />
  );
}

export default Merchant;
