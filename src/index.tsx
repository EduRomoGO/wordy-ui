import React from "react";
import ReactDOM from "react-dom";
import "./reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import AppProviders from "components/providers/AppProviders";
import AppErrorBoundary from "./AppErrorBoundary";
import { withAuthenticator } from "@aws-amplify/ui-react";

const AppWithLogin = withAuthenticator(App);

ReactDOM.render(
  <AppErrorBoundary>
    <AppProviders>
      <AppWithLogin />
    </AppProviders>
  </AppErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
