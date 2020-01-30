import React from 'react';
import Word from '../Word/Word.js';

const Words = ({words, isFilterActive}) => {
    return <div>
        {words.map(({word, phonemics}, id) => <Word short={isFilterActive} key={id} word={word} phonemics={phonemics} />)}
    </div>
};

export default Words;