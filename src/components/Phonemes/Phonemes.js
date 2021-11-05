import React from "react";
import "./Phonemes.css";
import { consonants, vowels, diphthongs } from "./PhonemesList.js";
import cuid from "cuid";

const Phonemes = ({ onComponentLoad }) => {
  React.useEffect(() => {
    onComponentLoad();
  }, [onComponentLoad]);

  const handleOnClick = (e, file) => {
    document.querySelector(`#${file}`).play();
  };

  const getPhonemList = (items, type) => (
    <article className="phonemes-article">
      <p className="title">{type}</p>
      <div className={`phonemList ${type}`}>
        {items.map(({ phonem, word }) => {
          const newPhonem = phonem.includes(":")
            ? phonem.replace(":", "\\:")
            : phonem;
          return (
            <div key={cuid()} className="pair">
              <span
                className="phonem"
                onClick={(e) => handleOnClick(e, newPhonem)}
              >
                {phonem}
              </span>
              <audio hidden={true} id={phonem} controls>
                <source
                  src={`./phonemesFiles/${phonem}.mp3`}
                  type="audio/mpeg"
                ></source>
                Your browser does not support the audio element.
              </audio>
              <span
                className="phonem-word"
                onClick={(e) => handleOnClick(e, word)}
              >
                {word}
              </span>
              <audio hidden={true} id={word} controls>
                <source
                  src={`./phonemesFiles/${word}.mp3`}
                  type="audio/mpeg"
                ></source>
                Your browser does not support the audio element.
              </audio>
            </div>
          );
        })}
      </div>
    </article>
  );

  return (
    <section className="phonemes-component-wrapper">
      <section className="phonemes-lists-wrapper">
        {getPhonemList(consonants, "consonants")}
        {getPhonemList(vowels, "vowels")}
        {getPhonemList(diphthongs, "diphthongs")}
      </section>
    </section>
  );
};

export default Phonemes;
