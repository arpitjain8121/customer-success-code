import React, { useState } from "react";
import CrossVerificationComp from "../../components/crossVerification";

function CrossVerification() {
  const [documentType1, setDocumentType1] = useState("");
  const [documentType2, setDocumentType2] = useState("");
  const documentOption = [
    { value: 0, label: "Select Document" },
    { value: 1, label: "Aadhar" },
    { value: 2, label: "Check" },
    { value: 3, label: "Bank Statement" },
    { value: 4, label: "Pan Card" }
  ];

  const doc1 = {
    pinCode: 277001,
    bankName: "HSBC BANK",
    micrCode: 6767676,
    contact: 7777777777,
    branch: "Noida",
    name: "Pds Infotech",
    ifsc: "bbbbbbbbb",
    accountNumber: 767677676766767,
    response: "rr",
    amountMatch: "am",
    active: "true"
  };
  const doc2 = {
    pinCode: 201301,
    bankName: "ICICI BANK",
    micrCode: 6767677,
    contact: 7777777778,
    branch: "Delhi",
    name: "NexxusPay",
    ifsc: "gggggggggg",
    accountNumber: 767677676766768,
    response: "rr",
    amountMatch: "am",
    active: "false"
  };

  return (
    <CrossVerificationComp
      documentType1={documentType1}
      documentType2={documentType2}
      setDocumentType1={setDocumentType1}
      setDocumentType2={setDocumentType2}
      documentOption={documentOption}
      doc1={doc1}
      doc2={doc2}
    />
  );
}

export default CrossVerification;
