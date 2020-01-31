import React from 'react';
import Word from '../Word/Word.js';
import './Words.css';


const Words = ({words, isFilterActive}) => {
    const getClassName = () => isFilterActive ? 'short' : 'normal';

    return <div className={`words-${getClassName()}`}>
        {words.map(({word, phonemics}, id) => <Word short={isFilterActive} key={id} word={word} phonemics={phonemics} />)}
    </div>
};

export default Words;