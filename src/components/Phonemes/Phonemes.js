import React, { useEffect, useState, useRef } from "react";
import "./Phonemes.css";
import { consonants, vowels, diphthongs } from "./PhonemesList.js";
import { Storage } from 'aws-amplify';

const PhonemList = ({items, type}) => {
  return (<article className="phonemes-article">
    <p className="title">{type}</p>
    <div className={`phonemList ${type}`}>
      {items.map(({ phonem, word }) => {
        return <Phoneme key={`${phonem}-${word}`} phonem={phonem} word={word} />
      })}
    </div>
  </article>
)};


const Phonemes = () => {
  return (
    <section className="phonemes-component-wrapper">
      <section className="phonemes-lists-wrapper">
        {/* <PhonemList items={consonants} type='consonants' /> */}
        <PhonemList items={vowels} type='vowels'  />
        {/* <PhonemList items={diphthongs} type='diphthongs'  /> */}
      </section>
    </section>
  );
};

export default Phonemes;


function Phoneme({phonem, word}) {
  const [wordFile, setWordFile] = useState('')
  const phonemeRef = useRef()
  const wordRef = useRef()

  const handlePhonemeClick = () => {
    phonemeRef.current.play()
  }

  const handleWordClick = () => {
    wordRef.current.play()
  }

  useEffect(() => {
    const getWord = async () => {
        const file = await Storage.get(`${word}.mp3`)
        setWordFile(file)
    }

    getWord()

  },[word])

  return (
    <div className="pair">
      <span
        className="phonem"
        onClick={handlePhonemeClick}
      >
        {phonem}
      </span>
      <audio ref={phonemeRef} hidden={true} controls>
        <source
          src={`./phonemesFiles/${phonem}.mp3`}
          type="audio/mpeg"
        ></source>
        Your browser does not support the audio element.
      </audio>

      {wordFile && (<>      <span
        className="phonem-word"
        onClick={handleWordClick}
      >
        {word}
      </span>
      <audio ref={wordRef} hidden={true} controls>
        <source
          src={wordFile}
          type="audio/mpeg"
        ></source>
        Your browser does not support the audio element.
      </audio></>)}

    </div>
  );
}
