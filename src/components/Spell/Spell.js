import React, { useEffect, useState } from "react";
import { useDatabase } from "hooks/useDatabase";
import Word from "../Word/Word.js";
import cuid from "cuid";
import "./Spell.css";

const Spell = ({ onComponentLoad }) => {
  const { getDescriptorsForWords } = useDatabase();
  const [letterDescriptors, setLetterDescriptors] = useState([]);
  const [status, setStatus] = useState("idle");

  const letters = React.useMemo(
    () => [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ],
    []
  );

  useEffect(() => {
    const loadLetterDescriptors = async () => {
      try {
        setStatus("loading");

        const letterDescriptors = await getDescriptorsForWords(letters);
        setStatus("resolved");
        setLetterDescriptors(letterDescriptors);
        onComponentLoad();
      } catch (error) {
        setStatus("rejected");
        console.error(`Error loading letter descriptors - ${error}`);
      }
    };

    loadLetterDescriptors();
  }, [getDescriptorsForWords, letters, onComponentLoad]);

  if (status === "idle" || status === "loading") {
    return <div>loading...</div>;
  }

  if (status === "rejected") {
    return <div>An error has happened</div>;
  }

  if (status === "resolved") {
    return (
      <div className="spell-component-wrapper">
        {letterDescriptors.map(({ word, phonemics }) => (
          <Word type="spell" key={cuid()} word={word} phonemics={phonemics} />
        ))}
      </div>
    );
  }
};

export default Spell;
