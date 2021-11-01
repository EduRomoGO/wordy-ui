import React, { useState } from "react";
import WordsList from "../WordsList/WordsList";

function Phrase({ inputWords, handlePlayClick }) {
  const [muted, setMuted] = useState(false);

  const handleMuteButtonClick = () => setMuted((muted) => !muted);

  return (
    <section>
      <button onClick={() => handlePlayClick(muted)}>
        Play Search (alt+p)
      </button>
      <button onClick={handleMuteButtonClick}>mute</button>
      <WordsList words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
