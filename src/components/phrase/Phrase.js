/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../WordsList/WordsList";

// Note: There is probably a much better way of doing this, but I don't want to spend more time on it atm
// Using references is the way to avoid rerenderings of the ui while helping to manage playing/stop states

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
    if (!playing) {
      startPlaying();
    }
  }

  const startPlaying = () => {
    playing = true;
    const audioElements = [...wordsRef.current.querySelectorAll("audio")];

    const timeBetweenWordsInMs = 50;
    let elapsedTimeInMs = 0;

    // We schedule each audio to play after the previous one has finished
    audioElements.forEach((audio) => {
      timeoutListRef.push(
        setTimeout(() => {
          audio.play();
        }, elapsedTimeInMs)
      );

      elapsedTimeInMs += audio.duration * 1000 + timeBetweenWordsInMs;
    });

    // After all the audios have finished playing we change reference to playing false
    setTimeout(() => {
      playing = false;
    }, elapsedTimeInMs);
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
      <small
        css={css`
          margin-top: 4px;
          display: inline-block;
          padding: 8px;
          font-size: 0.7rem;
        `}
      >
        Toggle play/stop using{" "}
        <kbd
          css={css`
            font-weight: bold;
            background: #e8e2e2;
            border-radius: 2px;
            font-style: italic;
            padding: 2px 4px;
          `}
        >
          Command + u
        </kbd>{" "}
        from your keyboard
      </small>

      <WordsList ref={wordsRef} words={inputWords} display="inline" />
    </section>
  );
}

export default Phrase;
