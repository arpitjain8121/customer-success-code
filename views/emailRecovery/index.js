import React, { useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

import EmailRecoveryComp from "../../components/emailRecovery";
import { forgotPassword } from "../../redux/auth/action";
import CONSTANTS from "../../constants";

const {
  ROUTES: { FORGOT_PASSWORD }
} = CONSTANTS;

export default function EmailRecovery() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email } = location.state;

  const handleSend = async () => {
    setLoading(true);
    setError("");

    try {
      await dispatch(forgotPassword(email));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <Redirect to={FORGOT_PASSWORD} />;
  }

  return (
    <EmailRecoveryComp
      error={error}
      loading={loading}
      handleSend={handleSend}
    />
  );
}
