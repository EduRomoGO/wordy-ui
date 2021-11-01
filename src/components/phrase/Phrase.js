import React, { useState } from "react";
import WordsList from "../WordsList/WordsList";

function Phrase({ isFilterActive, inputWords, handlePlayClick }) {
  const [muted, setMuted] = useState(false);

  const handleMuteButtonClick = () => setMuted((muted) => !muted);

  const getFilteredWords = () => {
    if (isFilterActive) {
      return <WordsList words={inputWords} isFilterActive={isFilterActive} />;
    }
  };

  return (
    <section>
      <button onClick={() => handlePlayClick(isFilterActive, muted)}>
        Play Search (alt+p)
      </button>
      <button onClick={handleMuteButtonClick}>mute</button>
      {getFilteredWords()}
    </section>
  );
}

export default Phrase;
