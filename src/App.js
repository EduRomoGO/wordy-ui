/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import Phonemes from "./components/Phonemes/Phonemes.js";
import Spell from "./components/Spell/Spell.js";
import { Words } from "./components/pages/words/Words";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { DatabaseProvider } from "./components/providers/DatabaseProvider";

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
              <DatabaseProvider>
                <Words />
              </DatabaseProvider>
            </Route>
            <Route path="/phonemes">
              <Phonemes />
            </Route>
            <Route path="/spell">
              <Spell />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
