/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Suspense, lazy, useEffect, useState, useCallback } from "react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import { Words } from "./components/pages/words/Words";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { loadPendingParts } from "utils/db/load-all";
// import useDatabaseLoadingStatus from "hooks/useDatabaseLoadStatus";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";

const Phonemes = lazy(() => import("./components/Phonemes/Phonemes.js"));
const Spell = lazy(() => import("./components/Spell/Spell.js"));

const createOrOpenDb = () => {
  const db = new window.PouchDB("wordsDB");
  console.log(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

  return db;
};

const DatabaseLoadingStatus = () => {
  const { loadStatus, setLoadStatus } = useDatabaseLoadStatusContext();

  useEffect(() => {
    const db = createOrOpenDb();

    const asyncWrapper = async () => {
      const failedPendingParts = await loadPendingParts(db);
      if (failedPendingParts.length > 0) {
        await loadPendingParts(db, failedPendingParts);

        setLoadStatus("fullyLoaded");
      } else {
        setLoadStatus("fullyLoaded");
      }
    };

    if (loadStatus !== "fullyLoaded") {
      asyncWrapper();
    }
  }, [loadStatus, setLoadStatus]);

  return (
    <div>
      {loadStatus === "fullyLoaded" ? (
        <div>Database is fully updated</div>
      ) : (
        <div>database loading in progress</div>
      )}
    </div>
  );
};

function App() {
  const [componentLoaded, setComponentLoaded] = useState(false);

  const handleComponentLoaded = useCallback(() => {
    setComponentLoaded(true);
  }, []);

  return (
    <Router>
      <div className="App fluid-type">
        <header>
          {componentLoaded && <DatabaseLoadingStatus />}

          <NavMenu />
        </header>

        <main
          css={css`
            padding: 20px;
          `}
        >
          <Switch>
            <Route path="/words">
              <Words onComponentLoad={handleComponentLoaded} />
            </Route>
            <Suspense fallback={<div>Loading...</div>}>
              <Route path="/phonemes">
                <Phonemes onComponentLoad={handleComponentLoaded} />
              </Route>
              <Route path="/spell">
                <Spell onComponentLoad={handleComponentLoaded} />
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
