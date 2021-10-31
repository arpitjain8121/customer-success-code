import React, { useState } from "react";
import { useLocation, Redirect, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import CONSTANTS from "../../constants";
import { isPassword } from "../../utils";
import { useFormValidation } from "../../hooks/useFormValidation";
import { FormattedMessage } from "react-intl";
import { changePassword } from "../../redux/auth/action";
import ChangePasswordComponent from "../../components/changePassword";

const {
  ROUTES: { LOGIN }
} = CONSTANTS;

const schema = {
  newPassword: {
    value: "",
    required: true,
    validator: {
      regEx: isPassword,
      error: (
        <FormattedMessage defaultMessage="Please enter a correct password" />
      )
    }
  },
  confirmPassword: {
    value: "",
    required: true,
    validator: {
      sameAs: "newPassword",
      error: (
        <FormattedMessage defaultMessage="New Password and Confirm Password Mismatch" />
      )
    }
  }
};

export default function ChangePassword() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    state: { newPassword, confirmPassword },
    disable,
    handleChange,
    handleSubmit,
    handleBlur
  } = useFormValidation(schema, handleSend);

  const { uid, email } = location.state || {};

  async function handleSend() {
    setLoading(true);
    setError("");

    try {
      await dispatch(
        changePassword({
          uid,
          email,
          password: newPassword.value,
          confirmPassword: confirmPassword.value
        })
      );
      history.push({ pathname: LOGIN });
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!(email && uid)) {
    return <Redirect to={LOGIN} />;
  }

  return (
    <ChangePasswordComponent
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      disable={disable}
      error={error}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
}
