import React, { useState } from "react";
import WordsList from "../WordsList/WordsList";

function Phrase({ inputWords, handlePlayClick }) {
  const [muted, setMuted] = useState(false);

  const isFilterActive = inputWords.length > 0;

  const handleMuteButtonClick = () => setMuted((muted) => !muted);

  return (
    isFilterActive && (
      <section>
        <button onClick={() => handlePlayClick(isFilterActive, muted)}>
          Play Search (alt+p)
        </button>
        <button onClick={handleMuteButtonClick}>mute</button>
        <WordsList words={inputWords} isFilterActive={isFilterActive} />
      </section>
    )
  );
}

export default Phrase;
