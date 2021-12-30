import React, { useEffect, useState, useRef } from "react";
import "./Word.css";
import { Storage } from "aws-amplify";

const Word = ({ short, word, phonemics, type, onClick }) => {
  const [wordFile, setWordFile] = useState("");
  const wordRef = useRef();
  const handleOnMouseOver = () => {
    const audio = wordRef.current;
    audio.play();

    setTimeout(() => {
      if (onClick !== undefined) {
        onClick(word);
      }
    }, audio.duration * 1000);
  };

  const getWord = () =>
    short ? (
      <span onMouseOver={handleOnMouseOver} onClick={handleOnMouseOver}>
        <span className="word-name"> {word}</span>
        <span className="word-phonemics"> ({phonemics})</span>
      </span>
    ) : (
      <div>
        <div className="word-name">{word}</div>
        <div className="word-phonemics">{phonemics}</div>
      </div>
    );

  const getClassName = () => {
    let typeClass = "";

    if (type === "spell") {
      typeClass = "spell";
    } else {
      typeClass = short ? "short" : "normal";
    }

    return `word ${typeClass}`;
  };

  useEffect(() => {
    const getWordAudio = async () => {
      const file = await Storage.get(`words/${word}.mp3`);
      setWordFile(file);
    };
    getWordAudio();
  }, [word]);

  return (
    <div className={getClassName()} onClick={handleOnMouseOver}>
      {wordFile && (
        <>
          {getWord()}
          <audio hidden={true} ref={wordRef} controls>
            <source src={wordFile} type="audio/mpeg"></source>
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </div>
  );
};

export default Word;
