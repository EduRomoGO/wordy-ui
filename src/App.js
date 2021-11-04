/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Suspense, lazy } from "react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import { Words } from "./components/pages/words/Words";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const Phonemes = lazy(() => import("./components/Phonemes/Phonemes.js"));
const Spell = lazy(() => import("./components/Spell/Spell.js"));

function App() {
  return (
    <Router>
      <div className="App fluid-type">
        <header>
          <NavMenu />
        </header>

        <main
          css={css`
            padding: 20px;
          `}
        >
          <Redirect from="/" to="/words" />
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
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
