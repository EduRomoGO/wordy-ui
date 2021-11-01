import React from "react";
import Word from "../Word/Word.js";
import "./WordsList.css";
import cuid from "cuid";

const WordsList = ({ words, isFilterActive = false, onClick }) => {
  const getClassName = () => (isFilterActive ? "short" : "normal");
  const getKey = () => cuid();

  return (
    <div className={`words-${getClassName()}`}>
      {words.map(({ word, phonemics }, id) => (
        <Word
          onClick={onClick}
          short={isFilterActive}
          key={getKey(id)}
          word={word}
          phonemics={phonemics}
        />
      ))}
    </div>
  );
};

export default WordsList;
