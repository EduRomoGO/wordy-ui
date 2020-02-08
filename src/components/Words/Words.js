import React from 'react';
import Word from '../Word/Word.js';
import './Words.css';
import cuid from 'cuid';

const Words = ({words, isFilterActive, onClick}) => {
    const getClassName = () => isFilterActive ? 'short' : 'normal';
    const getKey = () => cuid();

    return <div className={`words-${getClassName()}`}>
        {words.map(({word, phonemics}, id) => <Word onClick={onClick} short={isFilterActive} key={getKey(id)} word={word} phonemics={phonemics} />)}
    </div>
};

export default Words;