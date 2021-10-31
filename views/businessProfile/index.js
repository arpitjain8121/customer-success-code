import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import CONSTANTS from "../../constants";
import BusinessProfileComp from "../../components/businessProfile";
import schema from "./schema";
import { useFormValidation } from "../../hooks/useFormValidation";
import {
  getBusinessProfile,
  verifyPhone,
  verifyOtp,
  saveProfileDetails,
  getReferralDetails
} from "../../redux/business/action";

const {
  ROUTES: { HOME }
} = CONSTANTS;

function BusinessProfile() {
  const {
    state: {
      organizationName,
      businessPhoneNumber,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      email,
      ownerFirstName,
      ownerLastName,
      ownerEmail
    },
    handleChange,
    handleBlur,
    updateState,
    disable
  } = useFormValidation(schema());

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referralName, setReferralName] = useState("");
  const [referralPhone, setReferralPhone] = useState("");
  const [referralLoader, setReferralLoader] = useState(false);
  const [referralError, setReferralError] = useState("");
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState({ value: "", error: "" });
  const [changePhone, setChangePhone] = useState(false);
  const [otpSubmitLoader, setOtpSubmitLoader] = useState(false);
  const [otpSentLoader, setOtpSentLoader] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otp, setOtp] = useState({ value: "", error: "" });
  const [disableVerify, setDisableVerify] = useState(true);
  const [ownerSuccess, setOwnerSuccess] = useState("");
  const [contacts, setContacts] = useState([
    { isdCode: "+974", current: true }
  ]);
  const [showVerifyPhoneModal, setShowVerifyPhoneModal] = useState(false);
  const [referralDetailsCopy, setReferralDetailsCopy] = useState();
  const [disableSave, setDisableSave] = useState(true);

  const [redirect, setRedirect] = useState(false);

  const profile = useSelector(state => state.business.profile);
  const referralDetails = useSelector(state => state.business.referralDetails);

  useEffect(() => {
    dispatch(getBusinessProfile()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (referralDetails) {
      setReferralDetailsCopy(referralDetails);
    }
  }, [referralDetails]);

  useEffect(() => {
    if (profile) {
      const {
        businessDetails: {
          name,
          phoneNumber,
          address1,
          address2,
          city,
          pinCode,
          email
        },
        ownerDetails: {
          firstName,
          lastName,
          email: ownerEmail,
          phoneNumber: ownerPhoneNumber,
          isPhoneVerified
        },
        partnerDetails: { partnerUid, name: partnerName, contactNumber }
      } = profile;

      updateState({
        city,
        email,
        organizationName: name,
        businessPhoneNumber: phoneNumber,
        addressLine1: address1,
        addressLine2: address2,
        postalCode: pinCode,
        ownerFirstName: firstName,
        ownerLastName: lastName,
        ownerEmail: ownerEmail
      });

      setOwnerPhone({ ...ownerPhone, value: ownerPhoneNumber });
      setReferralCode(partnerUid);
      setReferralName(partnerName);
      setReferralPhone(contactNumber);
      setIsPhoneVerified(isPhoneVerified);
      setShowVerifyPhone(!!ownerPhoneNumber);
      setDisableSave(disableSave && !isPhoneVerified);
    }
  }, [profile]);

  function handleChangePhone() {
    setIsPhoneVerified(false);
    setOwnerPhone({ value: "", error: "" });
    setShowVerifyPhone(false);
    setDisableSave(true);
  }

  function handleOwnerPhoneChange(e) {
    const { value } = e.target;
    const ownerPhone = value.replace(/_/g, "").replace(/ /g, "");
    setOwnerPhone({ value: ownerPhone, error: "" });
    if (ownerPhone.length > 7) {
      setShowVerifyPhone(true);
    } else {
      setShowVerifyPhone(false);
    }
  }

  function handleOwnerPhoneBlur() {
    if (ownerPhone.value.length === 8) {
      setOwnerPhone({ value: ownerPhone.value, error: "" });
    } else {
      setOwnerPhone({
        value: ownerPhone.value,
        error: (
          <FormattedMessage defaultMessage="Please provide a valid phone number" />
        )
      });
    }
  }

  async function handleVerifyPhone(e) {
    e.preventDefault();
    const ownerMobile = ownerPhone.value.replace(/_/g, "");

    if (ownerMobile?.length >= 8) {
      try {
        setShowVerifyPhone(true);
        setOtpSentLoader(true);
        await dispatch(verifyPhone(ownerMobile));
        setShowVerifyPhoneModal(true);
        setOtpSentLoader(false);
      } catch (err) {
        setOtpSentLoader(false);
        setShowVerifyPhoneModal(false);
        setShowVerifyPhone(true);
        setDisableSave(true);
        ownerPhone.error = err;
      }
    } else {
      ownerPhone.error = formatMessage({
        defaultMessage: "Please enter Valid Phone No"
      });
    }
  }

  async function handleResendOtp(e) {
    handleVerifyPhone(e);
    setOwnerSuccess(
      formatMessage({ defaultMessage: "Resent Otp Successfully" })
    );
  }

  function handleOtpChange(e) {
    const { value } = e.target;

    if (value.length >= 6) {
      if (!isNaN(value)) {
        setOtp({ value, error: "" });
        setDisableVerify(false);
      } else {
        setOtp({
          value,
          error: formatMessage({
            defaultMessage: "please enter 6 digit numeric otp"
          })
        });
        setDisableVerify(true);
      }
    } else {
      setOtp({
        value,
        error: ""
      });
      setDisableVerify(true);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    const { value } = otp;
    try {
      setOtpSubmitLoader(true);
      ownerPhone.error = "";
      await dispatch(verifyOtp(value));
      setIsPhoneVerified(true);
      setOtpSubmitLoader(false);
      setChangePhone(false);
      setDisableSave(false);
      setShowVerifyPhoneModal(false);
    } catch (err) {
      setOtp({
        value: "",
        error: err.data.message
      });
      setOtpSubmitLoader(false);
      throw err;
    }
  }

  function handleCloseModal() {
    setShowVerifyPhoneModal(false);
  }

  const handleReferralChange = async e => {
    const { value } = e.target;
    setReferralCode(value);
    setReferralError("");
    setReferralDetailsCopy(undefined);

    if (value.length >= 6) {
      try {
        setDisableSave(true);
        setReferralLoader(true);
        await dispatch(getReferralDetails(value));
        setReferralError("");
        setDisableSave(false);
        setReferralCode(value);
      } catch (err) {
        setReferralError(
          formatMessage({ defaultMessage: "Wrong Referral Code entered" })
        );
        setReferralDetailsCopy(undefined);
      } finally {
        setReferralLoader(false);
      }
    } else if (value.length === 0) {
      setReferralError("");
      setDisableSave(false);
      setReferralDetailsCopy(undefined);
    }
  };

  const handleReferralBlur = async e => {
    const { value } = e.target;
    if (value.length < 6 && value.length !== 0) {
      setDisableSave(true);
      setReferralError(
        formatMessage({
          defaultMessage: "Referral should be minimum 6 digit long"
        })
      );
      setReferralDetailsCopy(undefined);
    }
  };

  function handleContactChange(e, fieldName, index) {
    setDisableSave(true);
    const contactsCopy = [...contacts];
    if (fieldName === "phoneNumber") {
      contactsCopy[index][fieldName] = e.target.value
        .replace(/_/g, "")
        .replace(/ /g, "");
    } else {
      contactsCopy[index][fieldName] = e.target.value;
    }
    setContacts(contactsCopy);
  }

  function handleContactBlur(index) {
    const contactsCopy = [...contacts];
    const ownerPhone = contactsCopy[index].phoneNumber || "";
    const ownerName = contactsCopy[index].name || "";
    if (ownerName.length < 2 && ownerName.length > 0) {
      contactsCopy[index].error = {
        name: formatMessage({
          defaultMessage: "Name should be minimum 2 characters long"
        })
      };
      setDisableSave(true);
    } else if (ownerName.length >= 2 && ownerPhone.length === 0) {
      contactsCopy[index].error = {
        phone: formatMessage({
          defaultMessage: "Phone is Required"
        })
      };
      setDisableSave(true);
    } else if (ownerPhone.length !== 8 && ownerPhone.length > 0) {
      contactsCopy[index].error = {
        phone: formatMessage({
          defaultMessage: "Phone Number should be minimum 8 digit long"
        })
      };
      setDisableSave(true);
    } else if (ownerPhone.length === 8 && ownerName.length === 0) {
      contactsCopy[index].error = {
        name: formatMessage({
          defaultMessage: "Name is required"
        })
      };
      setDisableSave(true);
    } else {
      contactsCopy[index].error = { name: "", phone: "" };
      setDisableSave(false);
    }

    setContacts(contactsCopy);
  }

  function handleAddContact(e) {
    e.preventDefault();
    setContacts([...contacts, { isdCode: "+974", current: true }]);
  }

  async function handleSubmit() {
    const contactsCopy = contacts
      .filter(({ phoneNumber, name }) => phoneNumber && name)
      .map(contact => {
        contact.phoneNumber = contact.phoneNumber.replace(/ /g, "");
        return contact;
      });

    const data = {
      businessDetails: {
        name: organizationName.value,
        isdCode: "+974",
        phoneNumber: businessPhoneNumber.value,
        address1: addressLine1.value,
        address2: addressLine2.value,
        city: city.value,
        email: email.value,
        pinCode: postalCode.value
      },
      ownerDetails: {
        firstName: ownerFirstName.value,
        lastName: ownerLastName.value,
        isPhoneVerified: isPhoneVerified,
        isdCode: "+974",
        phoneNumber: ownerPhone.value,
        email: ownerEmail.value
      },
      partnerReferralCode: referralCode,
      additionalContact: contactsCopy.length > 0 ? contactsCopy : undefined
    };
    try {
      await dispatch(saveProfileDetails(data));
      setRedirect(true);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Redirect to={HOME} />;
  }

  return (
    <BusinessProfileComp
      profile={profile}
      organizationName={organizationName}
      businessPhoneNumber={businessPhoneNumber}
      addressLine1={addressLine1}
      addressLine2={addressLine2}
      city={city}
      postalCode={postalCode}
      email={email}
      ownerFirstName={ownerFirstName}
      ownerLastName={ownerLastName}
      ownerEmail={ownerEmail}
      ownerPhone={ownerPhone}
      handleOwnerPhoneChange={handleOwnerPhoneChange}
      handleOwnerPhoneBlur={handleOwnerPhoneBlur}
      handleChangePhone={handleChangePhone}
      showVerifyPhone={showVerifyPhone}
      showVerifyPhoneModal={showVerifyPhoneModal}
      otpSentLoader={otpSentLoader}
      otpSubmitLoader={otpSubmitLoader}
      handleCloseModal={handleCloseModal}
      ownerSuccess={ownerSuccess}
      otp={otp}
      handleOtpChange={handleOtpChange}
      disableVerify={disableVerify}
      handleOtpSubmit={handleOtpSubmit}
      isPhoneVerified={isPhoneVerified}
      referralCode={referralCode}
      referralName={referralName}
      referralPhone={referralPhone}
      referralError={referralError}
      referralLoader={referralLoader}
      referralDetails={referralDetailsCopy}
      handleReferralChange={handleReferralChange}
      handleReferralBlur={handleReferralBlur}
      loading={loading}
      handleChange={handleChange}
      handleBlur={handleBlur}
      changePhone={changePhone}
      handleVerifyPhone={handleVerifyPhone}
      handleResendOtp={handleResendOtp}
      contacts={contacts}
      handleAddContact={handleAddContact}
      handleContactChange={handleContactChange}
      handleContactBlur={handleContactBlur}
      handleSubmit={handleSubmit}
      disableSave={disableSave}
      disable={disable}
    />
  );
}

export default BusinessProfile;
