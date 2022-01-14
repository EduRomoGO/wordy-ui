/** @jsx jsx */
import { jsx, css } from "@emotion/react";
// eslint-disable-next-line
import React, { Suspense, lazy, useState } from "react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import { Words } from "./components/pages/words/Words";
import { ReactComponent as CancelIcon } from "SVG/cancel.svg";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useLoadPendingParts from "hooks/useLoadPendingParts";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";
import { Spinner } from "components/lib";

import Amplify from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

const Phonemes = lazy(() => import("./components/Phonemes/Phonemes.js"));
const Spell = lazy(() => import("./components/Spell/Spell.js"));

const DatabaseLoadingStatus = () => {
  const { loadStatus } = useDatabaseLoadStatusContext();
  const [visible, setVisible] = useState(true);

  const handleClearMessage = () => {
    setVisible(false);
  };

  const isLoaded = loadStatus === "fullyLoaded";

  const message = isLoaded
    ? "Database is fully loaded! 🎉🎉"
    : "Database loading in progress. Please be patient, this may take a while";

  if (visible) {
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: lightyellow;
          border-bottom: 1px solid hsl(240deg 9% 69% / 10%);
          position: relative;
          padding: 2px 0;
        `}
      >
        <p
          css={css`
            margin: 0;
            margin-right: 8px;
            font-size: 1rem;
          `}
        >
          {message}
        </p>
        {!isLoaded && <Spinner size="small" />}
        <div
          css={css`
            position: absolute;
            right: 3px;
            top: -3px;
            cursor: pointer;
          `}
          onKeyPress={handleClearMessage}
          onClick={handleClearMessage}
        >
          <CancelIcon
            css={css`
              width: 1rem;
              vertical-align: unset;
              fill: #807b7b;
            `}
          />
        </div>
      </div>
    );
  }

  return null;
};

function App({ signOut, user }) {
  useLoadPendingParts();

  return (
    <Router>
      <>
        {/* <h1>Hello {user.username}</h1> */}
        <button onClick={signOut}>Sign out</button>
      </>
      <div className="App fluid-type">
        <header>
          <DatabaseLoadingStatus />
          <NavMenu />
        </header>

        <main
          css={css`
            padding: 20px;
          `}
        >
          <Switch>
            <Route path="/words">
              <Words />
            </Route>
            <Suspense fallback={<Spinner />}>
              <Route path="/phonemes">
                <Phonemes />
              </Route>
              <Route path="/spell">
                <Spell />
              </Route>
            </Suspense>
            <Route path="/">
              <Words />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
// export default withAuthenticator(App);
