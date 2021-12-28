import React, { useEffect, useState } from "react";
import "./Phonemes.css";
import { consonants, vowels, diphthongs } from "./PhonemesList.js";
import { Storage } from 'aws-amplify';

const PhonemList = ({items, type, handleOnClick}) => {
  return (<article className="phonemes-article">
    <p className="title">{type}</p>
    <div className={`phonemList ${type}`}>
      {items.map(({ phonem, word }) => {
        return <Phoneme key={`${phonem}-${word}`} phonem={phonem} handleOnClick={handleOnClick} word={word} />
      })}
    </div>
  </article>
)};


const Phonemes = () => {
  const handleOnClick = (e, file) => {
    document.querySelector(`#${file}`).play();
  };

  return (
    <section className="phonemes-component-wrapper">
      <section className="phonemes-lists-wrapper">
        {/* <PhonemList items={consonants} type='consonants' handleOnClick={handleOnClick} /> */}
        <PhonemList items={vowels} type='vowels' handleOnClick={handleOnClick}  />
        {/* <PhonemList items={diphthongs} type='diphthongs' handleOnClick={handleOnClick}  /> */}
      </section>
    </section>
  );
};

export default Phonemes;


function Phoneme({phonem, handleOnClick, word}) {
  const newPhonem = phonem.includes(":")
    ? phonem.replace(":", "\\:")
    : phonem;

  const [wordFile, setWordFile] = useState('')

  useEffect(() => {
    console.log('word', word);
    const getWord = async () => {
        const file = await Storage.get(`${word}.mp3`)
        console.log('file', file)
        setWordFile(file)
    }

    getWord()

  },[word])  

  return (
    <div className="pair">
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
          src={wordFile}
          type="audio/mpeg"
        ></source>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

