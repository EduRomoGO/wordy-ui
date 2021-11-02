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
      stopPlaying();
    } else {
      startPlaying();
    }
  }

  const clearTimeoutList = () => {
    timeoutListRef.forEach(clearTimeout);
    timeoutListRef = [];
  };

  function handlePlayClick() {
    if (playing) {
      stopPlaying();
    } else startPlaying();
  }

  const startPlaying = () => {
    playing = true;
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

  const stopPlaying = () => {
    playing = false;
    clearTimeoutList();
  };

  const handleStopButtonClick = () => {
    stopPlaying();
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
