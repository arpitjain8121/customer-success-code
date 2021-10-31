import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

import ForgotPasswordComponent from "../../components/forgotPassword";
import { useFormValidation } from "../../hooks/useFormValidation";
import { forgotPassword } from "../../redux/auth/action";
import CONSTANTS from "../../constants";
import { isEmail } from "../../utils";

const {
  ROUTES: { EMAIL_RECOVERY }
} = CONSTANTS;

const schema = {
  email: {
    value: "",
    required: true,
    validator: {
      regEx: isEmail,
      error: (
        <FormattedMessage defaultMessage="Invalid Email ID. Please enter Email in Correct Format" />
      )
    }
  }
};

export default function ForgotPassword() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState();

  const {
    state: { email },
    disable,
    handleChange,
    handleBlur
  } = useFormValidation(schema);

  const handleSend = async () => {
    setLoading(true);
    setError("");
    try {
      await dispatch(forgotPassword(email.value));

      setRedirectPath({
        pathname: EMAIL_RECOVERY,
        state: { email: email.value }
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message ?? err.message);
    }
  };

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  return (
    <ForgotPasswordComponent
      email={email}
      error={error}
      disable={disable}
      loading={loading}
      handleBlur={handleBlur}
      handleSend={handleSend}
      handleChange={handleChange}
    />
  );
}
