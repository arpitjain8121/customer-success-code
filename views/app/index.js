import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { IntlProvider } from "react-intl";

import CustomRoute from "../../components/customRoute";
import LandingPage from "../../components/landingPage";
import GlobalLayout from "../../views/globalLayout";
import Dashboard from "../../views/dashboard";
import PageNotFound from "../../components/pageNotFound";
import CONSTANTS from "../../constants";

import "../../css/App.css";

const {
  ROUTES: { LANDING_PAGE, AUTH, HOME },
  BASE_API_URL
} = CONSTANTS;

axios.defaults.headers.common["X-Channel"] = "web";
axios.defaults.headers.common["Channel"] = "web";
axios.defaults.baseURL = BASE_API_URL;

// https://formatjs.io/docs/getting-started/message-distribution/#distribution

function loadLocaleData(locale) {
  if (locale === "en") {
    return import("../../lang/en.json");
  }
  return import("../../lang/ar.json");
}

function App() {
  const [messages, setMessages] = useState();

  const locale = useSelector(state => state.utils.locale);

  useEffect(() => {
    loadLocaleData(locale)
      .then(res => {
        setMessages(res);
      })
      .catch(err => {
        throw err;
      });
  }, [locale]);

  return (
    <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
      <Router>
        <Switch>
          <CustomRoute exact path={LANDING_PAGE} component={LandingPage} />
          <CustomRoute path={AUTH} component={GlobalLayout} />
          <CustomRoute isProtected path={HOME} component={Dashboard} />
          <CustomRoute path="*" component={PageNotFound} />
        </Switch>
      </Router>
    </IntlProvider>
  );
}

export default App;
