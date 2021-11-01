import React, { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../WordsList/WordsList";

function Phrase({ inputWords }) {
  const wordsRef = useRef();
  let { current: timeoutListRef } = useRef([]);
  useHotkeys("Command+u", () => {
    if (timeoutListRef.length > 0) {
      clearTimeoutList();
    } else {
      handlePlayClick({ isFilterActive: true, wordsRef });
    }
  });

  const clearTimeoutList = () => {
    timeoutListRef.forEach(clearTimeout);
    timeoutListRef = [];
  };

  const handlePlayClick = ({ wordsRef }) => {
    clearTimeoutList();
    const audioElements = [...wordsRef.current.querySelectorAll("audio")];

    const wordsSeparation = 50;
    let timeout = 0;

    audioElements.forEach((audio) => {
      timeoutListRef.push(
        setTimeout(() => {
          audio.play();
        }, timeout * 1000 + wordsSeparation)
      );

      timeout += audio.duration;
    });
  };

  const handleStopButtonClick = () => {
    clearTimeoutList();
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
