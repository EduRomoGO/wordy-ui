/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import { Words } from "./components/pages/words/Words";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { loadPendingParts } from "utils/db/load-all";

const Phonemes = lazy(() => import("./components/Phonemes/Phonemes.js"));
const Spell = lazy(() => import("./components/Spell/Spell.js"));

const createOrOpenDb = () => {
  const db = new window.PouchDB("wordsDB");
  console.log(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

  return db;
};

const DatabaseLoadingStatus = () => {
  const [fullyLoaded, setFullyLoaded] = useState(false);

  useEffect(() => {
    const db = createOrOpenDb();

    const asyncWrapper = async () => {
      const failedPendingParts = await loadPendingParts(db);
      if (failedPendingParts.length > 0) {
        await loadPendingParts(db, failedPendingParts);
        setFullyLoaded(true);
      } else {
        setFullyLoaded(true);
      }
    };

    if (!fullyLoaded) {
      asyncWrapper();
    }
  }, [fullyLoaded]);

  return (
    <div>
      {fullyLoaded ? (
        <div>Database is fully updated</div>
      ) : (
        <div>database loading in progress</div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
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
            <Suspense fallback={<div>Loading...</div>}>
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
