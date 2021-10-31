import React from "react";
import { Switch, Redirect } from "react-router-dom";

import CustomRoute from "../../components/customRoute";
import PageNotFound from "../../components/pageNotFound";
import GlobalLayoutComp from "../../components/globalLayout";
import Login from "../../views/login";
import CONSTANTS from "../../constants";

const {
  ROUTES: { LOGIN, AUTH }
} = CONSTANTS;

export default function GlobalLayout() {
  return (
    <GlobalLayoutComp>
      <Redirect from={AUTH} to={LOGIN} />
      <Switch>
        <CustomRoute path={LOGIN} component={Login} />
        <CustomRoute path="*" component={PageNotFound} />
      </Switch>
    </GlobalLayoutComp>
  );
}
