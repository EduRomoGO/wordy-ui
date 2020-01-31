import React, { useRef } from 'react';
import './Word.css';

const Word = ({short, word, phonemics}) => {
    const audio = useRef(null);

    const handleOnMouseOver = () => {
        audio.current.play();
    };

    const getWord = () => short
        ? <span onMouseOver={handleOnMouseOver}>
                <span className='word-name'> {word}</span>
                <span className='word-phonemics'> ({phonemics})</span>
            </span>
        : <div>
            <div>{word}</div>
            <div>{phonemics}</div>
        </div>;
    
    const getClassName = () => short ? 'short' : 'normal';

    return <div className={getClassName()}>
        {getWord()}
        <audio hidden={short} ref={audio} controls>
            <source  src={`./audioFiles/${word}.mp3`} type="audio/mpeg"></source>
            Your browser does not support the audio element.
        </audio>
    </div>
};

export default Word;