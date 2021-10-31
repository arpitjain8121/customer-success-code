import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { useFormValidation } from "../../hooks/useFormValidation";
import { isEmail, isLoginPassword } from "../../utils";
import { signIn } from "../../redux/auth/action";
import CONSTANTS from "../../constants";
import LoginForm from "../../components/login";

const {
  ROUTES: { DASHBOARD }
} = CONSTANTS;

const schema = {
  email: {
    value: "",
    required: true,
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Invalid email address" />
    }
  },
  password: {
    value: "",
    required: true,
    validator: {
      regEx: isLoginPassword,
      error: (
        <FormattedMessage defaultMessage="Please enter a correct password" />
      )
    }
  }
};

export default function Login() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loggedIn = useSelector(state => state.auth.loggedIn);

  const {
    state: { email, password },
    disable,
    handleChange,
    handleSubmit,
    handleBlur
  } = useFormValidation(schema, handleSend);

  async function handleSend() {
    setLoading(true);

    try {
      await dispatch(
        signIn({ mobileOrEmail: email.value, password: password.value })
      );
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message ?? err.message);
      throw err;
    }
  }

  if (loggedIn) {
    return <Redirect push to={DASHBOARD} />;
  }

  return (
    <LoginForm
      email={email}
      password={password}
      disable={disable}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
}
