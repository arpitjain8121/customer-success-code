import React, { useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import querystring from "querystring";

import { verifyInvitationToken } from "../../redux/auth/action";
import CONSTANTS from "../../constants";

const {
  ROUTES: { LOGIN, HOME }
} = CONSTANTS;

export default function Redir() {
  const dispatch = useDispatch();
  const location = useLocation();

  const loggedIn = useSelector(state => state.auth.loggedIn);
  const verifyError = useSelector(state => state.auth.verifyError);

  useEffect(() => {
    const { search } = location;

    if (search) {
      const { tokenId } = querystring.parse(search.slice(1));

      if (tokenId) {
        dispatch(verifyInvitationToken(tokenId));
      }
    }
  }, [dispatch, location]);

  if (loggedIn) {
    return <Redirect to={HOME} />;
  }

  if (verifyError) {
    return <Redirect to={LOGIN} />;
  }

  if (location.search) {
    return <div />;
  } else {
    return <Redirect to={LOGIN} />;
  }
}
