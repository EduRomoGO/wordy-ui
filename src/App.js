import React, { useState } from "react";
import "./App.css";
import NavMenu from "./components/NavMenu/NavMenu.js";
import Phonemes from "./components/Phonemes/Phonemes.js";
import Spell from "./components/Spell/Spell.js";
import { Words } from "./components/pages/words/Words";

function App() {
  const [menuItemSelected, setMenuItemSelected] = useState("words");

  const renderMenuItem = (menuItemSelected) => {
    if (menuItemSelected === "words") {
      return <Words />;
    } else if (menuItemSelected === "phonemes") {
      return <Phonemes />;
    } else if (menuItemSelected === "spell") {
      return <Spell />;
    }
  };

  return (
    <div className="App fluid-type">
      <NavMenu
        listOfItems={["words", "phonemes", "spell"]}
        action={(item) => setMenuItemSelected(item)}
        state={menuItemSelected}
      />
      {renderMenuItem(menuItemSelected)}
    </div>
  );
}

export default App;
