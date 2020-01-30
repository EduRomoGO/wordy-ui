import React from 'react';
import Word from '../Word/Word.js';

const Words = ({words}) => {
    return words.map(({word, phonemics}, id) => <Word key={id} word={word} phonemics={phonemics} />)
};

export default Words;