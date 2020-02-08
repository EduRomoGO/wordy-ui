import React from 'react';
import db from '../../utils/db/db.json';
import Word from '../Word/Word.js';
import cuid from 'cuid';
import './Spell.css';

const Spell = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const allDescriptors = db.wordDescriptors
    .map(item => ({ word: item.word, phonemics: item.phonemics }));
    
    const letterDescriptors = letters
        .map(item => {
            return allDescriptors.find(descriptor => descriptor.word === item.toLowerCase());
        })
        .filter(item => !!item);

    return <div className='spell-component-wrapper'>
        {letterDescriptors.map(({word, phonemics}) => <Word type='spell' key={cuid()} word={word} phonemics={phonemics} />)}
    </div>
};

export default Spell;