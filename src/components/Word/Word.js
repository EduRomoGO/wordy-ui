import React from 'react';
import './Word.css';

const Word = ({short, word, phonemics, type}) => {
    const handleOnMouseOver = (e) => {
        document.querySelector(`#${word}`).play();
    };

    const getWord = () => short
        ?   <span onMouseOver={handleOnMouseOver} onClick={handleOnMouseOver}>
                <span className='word-name'> {word}</span>
                <span className='word-phonemics'> ({phonemics})</span>
            </span>
        : <div>
            <div>{word}</div>
            <div>{phonemics}</div>
        </div>;
    
    const getClassName = () => {
        let typeClass = '';

        if (type === 'spell') {
            typeClass = 'spell';
        } else {
            typeClass = short ? 'short' : 'normal';
        }

        return `word ${typeClass}`;
    }

    return <div className={getClassName()} onClick={handleOnMouseOver}>
        {getWord()}
        <audio hidden={true} id={word} controls>
            <source src={`./audioFiles/${word}.mp3`} type="audio/mpeg"></source>
            Your browser does not support the audio element.
        </audio>
    </div>
};

export default Word;