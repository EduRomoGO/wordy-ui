import React from "react";
import WordsList from "../WordsList/WordsList";
import { useRef } from "react";

function Phrase({ inputWords, handlePlayClick, handleStopClick }) {
  const wordsRef = useRef();

  const handleStopButtonClick = () => {
    handleStopClick();
  };

  return (
    <section>
      <button onClick={() => handlePlayClick(wordsRef)}>
        Play Search (Command + u)
      </button>
      <button onClick={handleStopButtonClick}>Stop</button>
      <WordsList ref={wordsRef} words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
