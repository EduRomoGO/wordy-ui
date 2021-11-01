import React, { useState } from "react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import Phonemes from "./components/Phonemes/Phonemes.js";
import Spell from "./components/Spell/Spell.js";
import { Words } from "./components/pages/words/Words";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [menuItemSelected, setMenuItemSelected] = useState("words");

  return (
    <Router>
      <div className="App fluid-type">
        <NavMenu
          listOfItems={["words", "phonemes", "spell"]}
          action={(item) => setMenuItemSelected(item)}
          state={menuItemSelected}
        />

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
