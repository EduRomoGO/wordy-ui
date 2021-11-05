import React from "react";
import ReactDOM from "react-dom";
import "./reset.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { DatabaseProvider } from "./components/providers/DatabaseProvider";
import { DatabaseLoadStatusProvider } from "./components/providers/DatabaseLoadStatusProvider";

ReactDOM.render(
  <DatabaseProvider>
    <DatabaseLoadStatusProvider>
      <App />
    </DatabaseLoadStatusProvider>
  </DatabaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
