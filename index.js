import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./views/app";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store";
import { restoreSession } from "./redux/auth/action";
import config from "./config";

import "./index.css";

const store = configureStore();
store.dispatch(restoreSession());
config();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
