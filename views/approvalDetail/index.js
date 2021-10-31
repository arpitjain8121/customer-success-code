import React from "react";
import { useHistory } from "react-router-dom";
import { getRoute } from "../../utils";
import CONSTANTS from "../../constants";
import ApprovalDetailComp from "../../components/approvalDetail";

const {
  ROUTES: { MERCHANT }
} = CONSTANTS;

export default function ApprovalDetail({ location, match }) {
  const history = useHistory();

  const handleViewProfile = (businessId, name) => {
    history.push({
      pathname: getRoute(MERCHANT, { id: businessId }),
      state: { name: name }
    });
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <ApprovalDetailComp
      name={location?.state?.name}
      businessId={location?.state?.businessId}
      handleViewProfile={handleViewProfile}
      handleBack={handleBack}
    />
  );
}
