import React, { useState } from "react";
import WordsList from "../WordsList/WordsList";
import { useRef } from "react";

function Phrase({ inputWords, handlePlayClick }) {
  const [muted, setMuted] = useState(false);
  const wordsRef = useRef();

  const handleMuteButtonClick = () => setMuted((muted) => !muted);

  return (
    <section>
      <button onClick={() => handlePlayClick(muted, wordsRef)}>
        Play Search (alt+p)
      </button>
      <button onClick={handleMuteButtonClick}>mute</button>
      <WordsList ref={wordsRef} words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
