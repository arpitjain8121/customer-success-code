import React, { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CONSTANTS from "../../constants";
import { resendActivationLink } from "../../redux/auth/action";

import VerifyEmailComp from "../../components/verifyEmail";

const {
  ROUTES: { PRODUCT_SELECTION }
} = CONSTANTS;

export default function VerifyEmail() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyMessage = useSelector(state => state.auth.verifyMessage);

  const { email } = location.state || {};

  useEffect(() => {
    setError(verifyMessage);
  }, [verifyMessage]);

  async function handleSend() {
    setLoading(true);

    try {
      await dispatch(resendActivationLink(email));
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return <Redirect to={PRODUCT_SELECTION} />;
  }

  return (
    <VerifyEmailComp
      handleSend={handleSend}
      error={error}
      loading={loading}
      email={email}
    />
  );
}
