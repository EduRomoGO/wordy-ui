import React, { useRef } from 'react';

const Word = ({word, phonemics}) => {
    const handleOnMouseOver = () => {
        audio.current.play();
    };
    const audio = useRef(null);

    return <div>
        <div onMouseOver={handleOnMouseOver}>
            <div>{word}</div>
            <div>{phonemics}</div>
        </div>
        <audio ref={audio} id="myAudio" controls>
            <source  src={`./audioFiles/${word}.mp3`} type="audio/mpeg"></source>
            Your browser does not support the audio element.
        </audio>
    </div>
};

export default Word;