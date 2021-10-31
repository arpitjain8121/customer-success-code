import React, { useEffect, useState, useCallback } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useFormValidation } from "../../hooks/useFormValidation";
import CONSTANTS from "../../constants";
import { signUp } from "../../redux/auth/action";
import { validateDocument } from "../../redux/document/action";
import schema from "./schema";

import SignUpForm from "../../components/signup";

const {
  ROUTES: { VERIFY_EMAIL, PRODUCT_SELECTION }
} = CONSTANTS;

export default function SignUp() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [estbLoader, setEstbLoader] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [redirectPath, setRedirectPath] = useState();
  const [error, setError] = useState("");

  const {
    state: {
      businessName,
      establishmentID,
      email,
      phoneNumber,
      createPassword,
      confirmPassword
    },
    disable,
    handleChange,
    handleSubmit,
    handleBlur
  } = useFormValidation(schema, handleSend);

  const { productId } = location.state;

  const validateEstablishmetId = useCallback(async () => {
    if (establishmentID.value.length === 11) {
      setEstbLoader(true);

      try {
        await dispatch(validateDocument(establishmentID.value));
        setShowDialog(false);
      } catch (err) {
        if (err.response?.data?.httpStatus === 409) {
          setShowDialog(true);
        } else {
          throw err;
        }
      } finally {
        setEstbLoader(false);
      }
    }
  }, [establishmentID.value, dispatch]);

  useEffect(() => {
    validateEstablishmetId();
  }, [validateEstablishmetId]);

  const handleEstIdChange = e => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    validateEstablishmetId();
    handleChange(e);
  };

  const handleResetEstId = estRef => {
    setShowDialog(false);
    handleChange({ target: { name: "establishmentID", value: "" } });

    if (estRef.current) {
      estRef.current.focus();
    }
  };

  async function handleSend() {
    setLoading(true);

    const data = {
      productId,
      email: email.value,
      password: createPassword.value,
      documentId: establishmentID.value,
      businessName: businessName.value,
      confirmPassword: confirmPassword.value,
      businessPhoneNumber: phoneNumber.value
    };

    try {
      await dispatch(signUp(data));
      setRedirectPath({
        pathname: VERIFY_EMAIL,
        state: { email: email.value }
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  }

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  if (!productId) {
    return <Redirect to={PRODUCT_SELECTION} />;
  }

  return (
    <SignUpForm
      error={error}
      email={email}
      phoneNumber={phoneNumber}
      businessName={businessName}
      establishmentID={establishmentID}
      createPassword={createPassword}
      confirmPassword={confirmPassword}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
      disable={disable}
      loading={loading}
      estbLoader={estbLoader}
      handleEstIdChange={handleEstIdChange}
      handleResetEstId={handleResetEstId}
      showDialog={showDialog}
    />
  );
}
