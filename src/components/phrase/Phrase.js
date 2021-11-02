import React, { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../WordsList/WordsList";

function Phrase({ inputWords }) {
  let { current: playing } = useRef(false);
  const wordsRef = useRef();
  let { current: timeoutListRef } = useRef([]);
  useHotkeys("Command+u", togglePlaying);

  function togglePlaying() {
    if (playing) {
      playing = false;
      handleStopButtonClick();
    } else {
      playing = true;
      managePlay();
    }
  }

  const clearTimeoutList = () => {
    timeoutListRef.forEach(clearTimeout);
    timeoutListRef = [];
  };

  function handlePlayClick() {
    if (playing) {
      handleStopButtonClick();
    } else managePlay();
  }

  const managePlay = () => {
    const audioElements = [...wordsRef.current.querySelectorAll("audio")];

    const wordsSeparation = 50;
    let elapsedTime = 0;

    audioElements.forEach((audio) => {
      timeoutListRef.push(
        setTimeout(() => {
          audio.play();
        }, elapsedTime * 1000)
      );

      elapsedTime += audio.duration + wordsSeparation / 1000;
    });

    setTimeout(() => {
      playing = false;
    }, elapsedTime * 1000);
  };

  const handleStopButtonClick = () => {
    playing = false;
    clearTimeoutList();
  };

  return (
    <section>
      <button onClick={handlePlayClick}>Play Search</button>
      <button onClick={handleStopButtonClick}>Stop</button>
      <p>
        Toggle play/stop using <strong>Command + u</strong> from your keyboard
      </p>

      <WordsList ref={wordsRef} words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
