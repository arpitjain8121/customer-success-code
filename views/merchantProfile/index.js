import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader } from "../../components/common";
import { useIntl } from "react-intl";

import Profile from "../../components/merchantProfile";

import { useFormValidation } from "../../hooks/useFormValidation";
import {
  getBusinessProfile,
  updateBusiness
} from "../../redux/business/action";
import { getCityDetails, fetchBanks } from "redux/util/action";

import schema from "./schema";

export default function MerchantProfile({
  mid,
  hideEdit,
  newApplicationPhone
}) {
  const dispatch = useDispatch();
  const locationCheck = useLocation();
  const intl = useIntl();

  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editMode, setEditMode] = useState(!hideEdit);
  const [showMccModal, setShowMccModal] = useState(false);
  const [showApproveModalData, setShowApproveModalData] = useState(false);
  const [showCancelModalData, setShowCancelModalData] = useState(false);
  const [prevPinCode, setPrevPinCode] = useState();
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [mcc, setMcc] = useState([]);
  const [ifscPrefix, setIfscPrefix] = useState();

  const partnerOptions = [
    {
      value: "0",
      label: intl.formatMessage({ defaultMessage: "Select A Partner" })
    },
    {
      value: "1",
      label: intl.formatMessage({ defaultMessage: "Direct Sale" })
    }
  ];

  const profile = useSelector(state => state.business.profile);
  const banks = useSelector(state => state.utils.banks);

  const {
    state,
    disable,
    clear,
    handleChange,
    handleBlur,
    updateState
  } = useFormValidation(schema());

  const formProps = (field = {}) => ({
    type: "text",
    showErr: true,
    name: field.name,
    value: field.value,
    error: field.error,
    label: field.label,
    required: !!field.required,
    disabled: !editMode,
    className: "form-item",
    onBlur: handleBlur,
    onChange: handleChange
  });

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBusinessProfile(mid)).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid, dispatch]);

  useEffect(() => {
    if (profile) {
      const {
        businessDetails: {
          businessName,
          registeredEmail,
          mobileNumber,
          additionalMobileNumber,
          communicationEmail,
          streetAddress,
          pinCode,
          city,
          state: stateName,
          businessLogoUrl
        } = {},
        businessBankDetails: {
          bankName,
          bankId,
          branchName,
          branchId,
          branchAddress,
          accountNumber,
          accountHolderName,
          swiftCode,
          ifsc
        } = {},
        ownerDetails: {
          firstName,
          lastName,
          email,
          mobileNumber: ownerPhoneNumber
        } = {},
        otherDetails: { productCategory, mcc, riskLevel, vertical } = {},
        partnerDetails: { partnerUid, name, phoneNumber } = {}
      } = profile;

      updateState({
        businessName,
        additionalMobileNumber,
        streetAddress,
        pinCode,
        city,
        state: stateName,
        registeredEmailId: registeredEmail,
        phoneNumber: mobileNumber,
        logo: businessLogoUrl,

        bankName: {
          value: bankId,
          label: bankName
        },
        branchName,
        branchId,
        branchAddress,
        accountNumber,
        swiftCode,
        ifsc: {
          value: branchId,
          label: ifsc
        },
        nameAsInBankAccount: accountHolderName,

        firstName: firstName,
        lastName: lastName,
        ownerEmail: email,
        ownerPhoneNumber,

        productCategory,
        riskLevel: riskLevel.id
          ? {
              value: riskLevel.id,
              label: riskLevel.name
            }
          : undefined,
        vertical: vertical.id
          ? {
              id: vertical.id,
              value: vertical.value,
              label: vertical.name
            }
          : undefined,
        partner: partnerUid
          ? {
              phoneNumber,
              label: name,
              value: partnerUid
            }
          : undefined
      });
      setAdditionalEmails(communicationEmail);
      setMcc(mcc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (newApplicationPhone) {
      updateState({ phoneNumber: newApplicationPhone });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newApplicationPhone]);

  useEffect(() => {
    if (
      state?.pinCode.value &&
      state.pinCode.value.length === 6 &&
      state.pinCode.value !== prevPinCode
    ) {
      getCityDetails(state.pinCode.value).then(res => {
        if (res.length) {
          setPrevPinCode(state.pinCode.value);
          updateState({
            city: res[0].cityName,
            state: res[0].stateName,
            cityId: res[0].cityId,
            stateId: res[0].stateId
          });
        }
      });
    }
  }, [state.pinCode]);

  const handleProductToggle = id => {
    console.log(`id`, id);
  };

  const handleClear = () => {
    clear();
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  const openMccModal = () => {
    setShowMccModal(true);
  };

  const closeMccModal = () => {
    setShowMccModal(false);
  };

  const handleSearchRisk = riskLevel => {
    handleChange({ target: { name: "riskLevel", value: riskLevel } });
  };

  const handleSearchVertical = vertical => {
    handleChange({ target: { name: "vertical", value: vertical } });
  };

  const handleSearchPartner = partner => {
    handleChange({ target: { name: "partner", value: partner } });
  };

  const handleSearchBank = bank => {
    handleChange({ target: { name: "bankName", value: bank } });
    setIfscPrefix(bank.ifscPrefix);
  };

  const handleIfscCode = ifsc => {
    const { address, branchId, name } = ifsc;

    updateState({
      ifsc,
      branchId,
      branchAddress: address,
      branchName: name
    });
  };

  const handleSaveProfile = () => {
    const stateValue = {};

    for (const key in state) {
      stateValue[key] = state[key].value;
    }

    const {
      businessName,
      registeredEmailId,
      phoneNumber,
      additionalMobileNumber,
      streetAddress,
      pinCode,
      city,
      cityId,
      stateId,
      state: stateName,
      firstName,
      lastName,
      ownerPhoneNumber,
      ownerEmail,
      partner,
      branchName,
      branchId,
      branchAddress,
      bankName,
      ifsc,
      swiftCode,
      accountNumber,
      riskLevel,
      vertical,
      productCategory,
      nameAsInBankAccount
    } = stateValue;

    const {
      businessDetails: { country, countryId, gatewayId, isdCode, signedUpDate },
      businessBankDetails: { productId },
      productsSubscribed
    } = profile;

    setLoading(true);

    dispatch(
      updateBusiness(mid, {
        businessDetails: {
          businessName,
          registeredEmail: registeredEmailId,
          mobileNumber: phoneNumber,
          additionalMobileNumber,
          streetAddress,
          city,
          cityId,
          pinCode,
          stateId,
          state: stateName,
          communicationEmail: additionalEmails,
          country,
          countryId,
          gatewayId,
          isdCode: isdCode || "+91",
          signedUpDate: new Date(signedUpDate).toISOString().split("T")[0]
        },
        ownerDetails: {
          firstName,
          lastName,
          email: ownerEmail,
          mobileNumber: ownerPhoneNumber
        },
        partnerDetails: {
          partnerUid: partner?.value,
          name: partner?.label,
          phoneNumber: partner?.phoneNumber
        },
        businessBankDetails: {
          bankId: bankName.value,
          bankName: bankName.label,
          branchName,
          branchId,
          branchAddress,
          accountNumber,
          swiftCode,
          ifsc: ifsc?.label,
          accountHolderName: nameAsInBankAccount,
          productId: productId || 2 // NOTE: 2 for POS
        },
        otherDetails: {
          mcc,
          vertical: {
            id: vertical?.id,
            name: vertical?.label,
            value: vertical?.value
          },
          riskLevel: {
            id: riskLevel?.value,
            name: riskLevel?.label
          },
          productCategory
        },
        productsSubscribed
      })
    ).finally(() => setLoading(false));
  };

  if (loading) {
    return <Loader center large />;
  }

  return (
    <Profile
      ifscPrefix={ifscPrefix}
      additionalEmails={additionalEmails}
      setAdditionalEmails={setAdditionalEmails}
      mcc={mcc}
      setMcc={setMcc}
      banks={banks}
      handleSearchBank={handleSearchBank}
      newApplicationPhone={newApplicationPhone}
      editMode={editMode}
      setEditMode={setEditMode}
      state={state}
      disable={disable}
      formProps={formProps}
      handleClear={handleClear}
      handleProductToggle={handleProductToggle}
      showEmailModal={showEmailModal}
      openEmailModal={openEmailModal}
      closeEmailModal={closeEmailModal}
      showMccModal={showMccModal}
      openMccModal={openMccModal}
      closeMccModal={closeMccModal}
      handleSearchRisk={handleSearchRisk}
      handleSearchVertical={handleSearchVertical}
      handleSearchPartner={handleSearchPartner}
      keyLocation={locationCheck?.state?.locationKey}
      keyName={locationCheck?.state?.name}
      showApproveModalData={showApproveModalData}
      setShowApproveModalData={setShowApproveModalData}
      showCancelModalData={showCancelModalData}
      setShowCancelModalData={setShowCancelModalData}
      partnerOptions={partnerOptions}
      handleIfscCode={handleIfscCode}
      profile={profile}
      handleSaveProfile={handleSaveProfile}
    />
  );
}
