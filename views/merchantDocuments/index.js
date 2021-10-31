import React, { useState } from "react";
import MerchantDocumentsComp from "../../components/merchantDocuments";

function MerchantDocuments() {
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);

  const handleReminder = () => {};

  return (
    <MerchantDocumentsComp
      initLoad={initLoad}
      loading={loading}
      handleReminder={handleReminder}
    />
  );
}

export default MerchantDocuments;
