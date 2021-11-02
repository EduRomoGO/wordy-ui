import React, { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../WordsList/WordsList";

const MediaButton = ({ playing }) => {
  return <div>{playing ? "hola" : "nada"}</div>;
};

function Phrase({ inputWords }) {
  let { current: playing } = useRef(false);
  // const [playing, setPlaying] = useState(false);
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
    }
    // setPlaying(true);
    else managePlay();
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
      // setPlaying(false);
      playing = false;
    }, elapsedTime * 1000);
  };

  const handleStopButtonClick = () => {
    playing = false;
    clearTimeoutList();
    // setPlaying(false);
  };

  return (
    <section>
      <MediaButton playing={playing} />
      <button onClick={handlePlayClick}>Play Search (Command + u)</button>
      <button onClick={handleStopButtonClick}>Stop</button>

      <WordsList ref={wordsRef} words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
