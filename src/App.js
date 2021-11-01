import React from "react";
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

function App() {
  return (
    <Router>
      <div className="App fluid-type">
        <NavMenu />

        <Redirect from="/" to="/words" />
        <Switch>
          <Route path="/words">
            <Words />
          </Route>
          <Route path="/phonemes">
            <Phonemes />
          </Route>
          <Route path="/spell">
            <Spell />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
