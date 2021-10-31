import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import bankDetailsSchema from "./bankDetailsSchema";
import qidSchema from "./qidSchema";
import crSchema from "./commercialRegistrationSchema";
import eidSchema from "./establishmentIdSchema";
import tlSchema from "./tradeLicenceSchema";

import UploadDocumentsComp from "../../components/uploadDocuments";
import CommonDoc from "../../components/uploadDocuments/commonDoc";
import BankDetails from "../../components/uploadDocuments/bankDetails";

import {
  getBankList,
  saveKycDocument,
  saveKycDetails,
  saveBankDetails
} from "../../redux/business/action";

import { useFormValidation } from "../../hooks/useFormValidation";
import { getDateFormat } from "../../utils";
import CONSTANTS from "../../constants";

const {
  PRODUCTS: { ECOM, POS, PAYROLL }
} = CONSTANTS;

function UploadDocuments({ tabs }) {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();
  const path = history.location.pathname;
  const product = path.substring(0, path.lastIndexOf("/")).replace("/", "");

  let productId;
  switch (product) {
    case "payroll":
      productId = PAYROLL;
      break;
    case "pos":
      productId = POS;
      break;
    case "ecom":
      productId = ECOM;
      break;
  }

  const AGREEMENT = "31";
  const BANK_DETAILS = "27";
  const QID = "5";
  const OFFICE_LOCATION = "38";
  const COMMERCIAL_REGISTRATION = "12";
  const ESTABLISHMENT_ID = "33";
  const TRADE_LICENCE = "36";

  const {
    state: { bankName, iban, confirmIban, accountNumber, confirmAccountNumber },
    handleChange,
    handleBlur,
    disable
  } = useFormValidation(bankDetailsSchema());

  const {
    state: { qidNumber, qidExp },
    handleChange: handleQidChange,
    handleBlur: handleQidBlur,
    disable: qidDisable
  } = useFormValidation(qidSchema());

  const {
    state: { crNumber, crExp },
    handleChange: handleCrChange,
    handleBlur: handleCrBlur,
    disable: crDisable
  } = useFormValidation(crSchema());

  const {
    state: { eidNumber, eidExp },
    handleChange: handleEidChange,
    handleBlur: handleEidBlur,
    disable: eidDisable
  } = useFormValidation(eidSchema());

  const {
    state: { tlNumber, tlExp },
    handleChange: handleTlChange,
    handleBlur: handleTlBlur,
    disable: tlDisable
  } = useFormValidation(tlSchema());

  const [activeTab, setActiveTab] = useState(0);
  const [agreementSaveLoader, setAgreementSaveLoader] = useState(false);
  const [agreementDocument, setAgreementDocument] = useState();
  const [bankLoading, setBankLoading] = useState(true);
  const [bankDetailsLoader, setBankDetailsLoader] = useState(false);
  const [bankStatement, setBankStatement] = useState();
  const [qidSaveLoader, setQidSaveLoader] = useState(false);
  const [qidImage1, setQidImage1] = useState();
  const [qidImage2, setQidImage2] = useState();
  const [officeSaveLoader, setOfficeSaveLoader] = useState(false);
  const [officeLocation1, setOfficeLocation1] = useState();
  const [officeLocation2, setOfficeLocation2] = useState();
  const [crSaveLoader, setCrSaveLoader] = useState(false);
  const [crDoc, setCrDoc] = useState();
  const [eidSaveLoader, setEidSaveLoader] = useState(false);
  const [eidDoc, setEidDoc] = useState();
  const [tlSaveLoader, setTlSaveLoader] = useState(false);
  const [tlDoc, setTlDoc] = useState();

  const [ibanError, setIbanError] = useState("");
  const [ibanDisable, setIbanDisable] = useState(true);
  const [accError, setAccError] = useState("");
  const [accDisable, setAccDisable] = useState(true);

  const bankList = useSelector(state => state.business.bankList);

  useEffect(() => {
    dispatch(getBankList()).then(() => setBankLoading(false));
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handleTabChange = currentTab => {
    setActiveTab(currentTab);
  };

  const handleAgreementSave = () => {
    setAgreementSaveLoader(true);
    dispatch(
      saveKycDocument({
        productId,
        documentTypeId: AGREEMENT,
        documentPic: agreementDocument
      })
    ).finally(() => setAgreementSaveLoader(false));
  };

  const handleBankBlur = e => {
    const { name, value } = e.target;
    handleBlur(e);

    const updatedValue = value.replace(/_/g, "").replace(/ /g, "");
    if (name === "iban") {
      if (updatedValue.length > 0 && confirmIban.value.length !== 0) {
        if (updatedValue !== confirmIban.value) {
          setIbanDisable(true);
          setIbanError(
            <FormattedMessage defaultMessage="IBANs do not match" />
          );
        } else {
          setIbanDisable(false);
          setIbanError("");
          confirmIban.error = "";
        }
      }
    } else if (name === "confirmIban") {
      if (updatedValue === iban.value) {
        setIbanDisable(false);
        setIbanError("");
      } else {
        setIbanDisable(true);
      }
    } else if (name === "accountNumber") {
      if (updatedValue.length > 0 && confirmAccountNumber.value.length !== 0) {
        if (updatedValue !== confirmAccountNumber.value) {
          setAccDisable(true);
          setAccError(
            <FormattedMessage defaultMessage="Accont Numbers do not match" />
          );
        } else {
          setAccDisable(false);
          setAccError("");
          confirmAccountNumber.error = "";
        }
      }
    } else if (name === "confirmAccountNumber") {
      if (updatedValue === accountNumber.value) {
        setAccDisable(false);
        setAccError("");
      } else {
        setAccDisable(true);
      }
    }
  };

  const handleBankStatementSave = () => {
    setBankDetailsLoader(true);
    dispatch(
      saveBankDetails({
        bankId: bankName.value,
        productId,
        documentTypeId: BANK_DETAILS,
        IBAN: iban.value,
        confirmIBAN: confirmIban.value,
        accountNumber: accountNumber.value,
        confirmAccountNumber: confirmAccountNumber.value,
        documentPic: bankStatement
      })
    ).finally(() => setBankDetailsLoader(false));
  };

  const handleQidSave = () => {
    setQidSaveLoader(true);
    dispatch(
      saveKycDetails({
        documentTypeId: QID,
        documentNumber: qidNumber.value,
        documentExpiry: getDateFormat(qidExp.value),
        documentPic: [qidImage1, qidImage2]
      })
    ).finally(() => setQidSaveLoader(false));
  };

  const handleOfficeLocationSave = () => {
    setOfficeSaveLoader(true);
    dispatch(
      saveKycDocument({
        productId,
        officeLocation1,
        officeLocation2,
        documentTypeId: OFFICE_LOCATION
      })
    ).finally(() => setOfficeSaveLoader(false));
  };

  const handleCrSave = () => {
    setCrSaveLoader(true);
    dispatch(
      saveKycDetails({
        documentTypeId: COMMERCIAL_REGISTRATION,
        documentNumber: crNumber.value,
        documentExpiry: getDateFormat(crExp.value),
        documentPic: crDoc
      })
    ).finally(() => setCrSaveLoader(false));
  };

  const handleEidSave = () => {
    setEidSaveLoader(true);
    dispatch(
      saveKycDetails({
        documentTypeId: ESTABLISHMENT_ID,
        documentNumber: eidNumber.value,
        documentExpiry: getDateFormat(eidExp.value),
        documentPic: eidDoc
      })
    ).finally(() => setEidSaveLoader(false));
  };

  const handleTlSave = () => {
    setTlSaveLoader(true);
    dispatch(
      saveKycDetails({
        documentTypeId: TRADE_LICENCE,
        documentNumber: tlNumber.value,
        documentExpiry: getDateFormat(tlExp.value),
        documentPic: tlDoc
      })
    ).finally(() => setTlSaveLoader(false));
  };

  const panes = {
    agreement: {
      title: <FormattedMessage defaultMessage="Agreement Document" />,
      content: (
        <CommonDoc
          docArray={[
            {
              docImage: agreementDocument,
              docTitle: formatMessage({ defaultMessage: "Upload Agreement" }),
              handleImageChange: setAgreementDocument
            }
          ]}
          disable={!agreementDocument}
          handleSave={handleAgreementSave}
          saveLoader={agreementSaveLoader}
        />
      )
    },
    bank: {
      title: <FormattedMessage defaultMessage="Bank Details" />,
      content: (
        <BankDetails
          bankLoading={bankLoading}
          ibanError={ibanError}
          ibanDisable={ibanDisable}
          accError={accError}
          accDisable={accDisable}
          handleChange={handleChange}
          handleBankBlur={handleBankBlur}
          bankList={bankList}
          bankName={bankName}
          iban={iban}
          confirmIban={confirmIban}
          accountNumber={accountNumber}
          confirmAccountNumber={confirmAccountNumber}
          disable={disable}
          bankStatement={bankStatement}
          setBankStatement={setBankStatement}
          handleBankStatementSave={handleBankStatementSave}
          bankDetailsLoader={bankDetailsLoader}
        />
      )
    },
    qid: {
      title: <FormattedMessage defaultMessage="QID Details" />,
      content: (
        <CommonDoc
          docArray={[
            {
              docImage: qidImage1,
              handleImageChange: setQidImage1,
              docTitle: formatMessage({ defaultMessage: "Upload QID Image1" })
            },
            {
              docImage: qidImage2,
              handleImageChange: setQidImage2,
              docTitle: formatMessage({ defaultMessage: "Upload QID Image2" })
            }
          ]}
          title={<FormattedMessage defaultMessage="QID Details" />}
          label={<FormattedMessage defaultMessage="QID Number" />}
          docNumber={qidNumber}
          docExpiry={qidExp}
          handleChange={handleQidChange}
          handleBlur={handleQidBlur}
          disable={qidDisable || !qidImage1 || !qidImage2}
          handleSave={handleQidSave}
          saveLoader={qidSaveLoader}
        />
      )
    },
    office: {
      title: <FormattedMessage defaultMessage="Office Location" />,
      content: (
        <CommonDoc
          docArray={[
            {
              docImage: officeLocation1,
              docTitle: formatMessage({
                defaultMessage: "Upload Office Image1"
              }),
              handleImageChange: setOfficeLocation1
            },
            {
              docImage: officeLocation2,
              docTitle: formatMessage({
                defaultMessage: "Upload Office Image2"
              }),
              handleImageChange: setOfficeLocation2
            }
          ]}
          disable={!officeLocation1 || !officeLocation2}
          handleSave={handleOfficeLocationSave}
          saveLoader={officeSaveLoader}
        />
      )
    },

    commercial: {
      title: <FormattedMessage defaultMessage="Commercial Registration" />,
      content: (
        <CommonDoc
          title={
            <FormattedMessage defaultMessage="Commercial Registration Details" />
          }
          label={
            <FormattedMessage defaultMessage="Commercial Registration Number" />
          }
          docNumber={crNumber}
          docExpiry={crExp}
          handleChange={handleCrChange}
          handleBlur={handleCrBlur}
          docArray={[
            {
              docImage: crDoc,
              docTitle: formatMessage({ defaultMessage: "Upload Document" }),
              handleImageChange: setCrDoc
            }
          ]}
          disable={crDisable || !crDoc}
          handleSave={handleCrSave}
          saveLoader={crSaveLoader}
        />
      )
    },
    establishment: {
      title: <FormattedMessage defaultMessage="Establishment ID" />,
      content: (
        <CommonDoc
          title={<FormattedMessage defaultMessage="Establishment ID Details" />}
          label={<FormattedMessage defaultMessage="Establishment ID Number" />}
          docNumber={eidNumber}
          docExpiry={eidExp}
          handleChange={handleEidChange}
          handleBlur={handleEidBlur}
          docArray={[
            {
              docImage: eidDoc,
              docTitle: formatMessage({ defaultMessage: "Upload Document" }),
              handleImageChange: setEidDoc
            }
          ]}
          disable={eidDisable || !eidDoc}
          handleSave={handleEidSave}
          saveLoader={eidSaveLoader}
        />
      )
    },
    trade: {
      title: <FormattedMessage defaultMessage="Trade License" />,
      content: (
        <CommonDoc
          title={<FormattedMessage defaultMessage="Trade Licence Details" />}
          label={<FormattedMessage defaultMessage="Trade Licence Number" />}
          docNumber={tlNumber}
          docExpiry={tlExp}
          handleChange={handleTlChange}
          handleBlur={handleTlBlur}
          docArray={[
            {
              docImage: tlDoc,
              docTitle: formatMessage({ defaultMessage: "Upload Document" }),
              handleImageChange: setTlDoc
            }
          ]}
          disable={tlDisable || !tlDoc}
          handleSave={handleTlSave}
          saveLoader={tlSaveLoader}
        />
      )
    }
  };

  return (
    <UploadDocumentsComp
      handleBack={handleBack}
      panes={tabs.map(tab => panes[tab])}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}

export default UploadDocuments;
