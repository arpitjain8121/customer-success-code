import React, { useState, createContext } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ApplicationDetailsComp from "components/applicationDetails";

export const PermissionContext = createContext({});

export default function ApplicationDetails({
  match,
  location,
  modulePermission
}) {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(0);
  const [rejectVisible, setRejectVisible] = useState(false);

  const [businessName = "", entityTypeName = ""] = useSelector(state => {
    const { businessName, entityTypeName } =
      state.applications?.activeApplication || {};
    return [businessName, entityTypeName];
  });

  const handleFinalRejection = msg => {
    console.log(`msg`, msg);
    setRejectVisible(false);
  };

  const handleFinalApproval = () => {
    console.log("Approved");
  };

  return (
    <PermissionContext.Provider value={modulePermission}>
      <ApplicationDetailsComp
        newApplicationPhone={location?.state?.phone}
        activeTab={activeTab}
        handleFinalApproval={handleFinalApproval}
        handleFinalRejection={handleFinalRejection}
        rejectVisible={rejectVisible}
        setRejectVisible={setRejectVisible}
        applicationId={match?.params?.id}
        handleBack={!location?.state?.phone && history.goBack}
        handleTabChange={tab => setActiveTab(tab)}
        businessName={businessName}
        entityTypeName={entityTypeName}
        title={
          location?.state?.phone
            ? `Application: +91 ${location?.state?.phone}`
            : `Application ID : ${match?.params?.id}${
                businessName
                  ? ` | Name: ${businessName} - ${entityTypeName}`
                  : ""
              }`
        }
      />
    </PermissionContext.Provider>
  );
}
