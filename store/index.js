import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

import rootReducer from "../redux";

export default function configureStore() {
  const composeEnhancers =
    process.env.NODE_ENV === "development" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;
  const enhancer = composeEnhancers(applyMiddleware(thunk));
  return createStore(rootReducer, enhancer);
}
