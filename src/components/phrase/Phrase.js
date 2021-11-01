import React, { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../WordsList/WordsList";

let timeoutList = [];

function Phrase({ inputWords }) {
  const wordsRef = useRef();
  useHotkeys("Command+u", () => {
    handlePlayClick({ isFilterActive: true, wordsRef });
  });

  const handlePlayClick = ({ wordsRef }) => {
    const audioElements = [...wordsRef.current.querySelectorAll("audio")];

    const wordsSeparation = 50;
    let timeout = 0;

    audioElements.forEach((audio) => {
      timeoutList.push(
        setTimeout(() => {
          audio.play();
        }, timeout * 1000 + wordsSeparation)
      );

      timeout += audio.duration;
    });
  };

  const handleStopButtonClick = () => {
    timeoutList.forEach(clearTimeout);
  };

  return (
    <section>
      <button onClick={() => handlePlayClick({ wordsRef })}>
        Play Search (Command + u)
      </button>
      <button onClick={handleStopButtonClick}>Stop</button>
      <WordsList ref={wordsRef} words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
