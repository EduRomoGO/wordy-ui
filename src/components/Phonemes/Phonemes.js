import React from 'react'
import './Phonemes.css';

const Phonemes = () =>{
  const consonants = [
    {
      phonem: 'p', 
      word: 'soup'
    },{
      phonem: 'b',
      word: 'bat'
    },
    {
      phonem: 't',
      word:'light'
    },
    {
      phonem: 'd',
      word: 'dog'
    },
    {
      phonem: 'k',
      word: 'cap'
    },
    {
      phonem: 'g',
      word: 'bag'
    },
    {
      phonem: 'm',
      word: 'man'
    },
    {
      phonem: 'n',
      word: 'rain'
    },
    {
      phonem: 'ŋ',
      word: 'king'
    },
    {
      phonem: 'f',
      word: 'fish'
    },
    {
      phonem: 'v',
      word: 'van'
    },
    {
      phonem: 'θ',
      word: 'thumb'
    },
    {
      phonem: 'ð',
      word: 'mother'
    },
    {
      phonem: 's',
      word: 'mouse'
    },
    {
      phonem: 'z',
      word: 'zebra'
    },
    {
      phonem: 'ʃ',
      word: 'shoe'
    },
    {
      phonem: 'ʒ',
      word: 'television'
    },
    {
      phonem: 'h',
      word: 'hand'
    },
    {
      phonem: 'tʃ',
      word: 'cheese'
    },
    {
      phonem: 'dʒ',
      word: 'jet'
    },
    {
      phonem: 'r',
      word: 'write'
    },
    {
      phonem: 'l',
      word: 'long'
    },
    {
      phonem: 'j',
      word: 'yo-yo'
    },
    {
      phonem: 'w',
      word: 'whale'
    }
  ]

  const vowels = [    
    {
      phonem: 'i:',
      word: 'sea'
    },
    {
      phonem: 'ɪ',
      word: 'swim'
    },
    {
      phonem: 'e',
      word: 'bed'
    },
    {
      phonem: 'æ',
      word: 'cat'
    },
    {
      phonem: 'ɑ:',
      word: 'car'
    },
    {
      phonem: 'ʌ',
      word: 'cup'
    },
    {
      phonem: 'ɒ',
      word: 'lock'
    },
    {
      phonem: 'ɔ:',
      word: 'ball'
    },
    {
      phonem: 'ʊ',
      word: 'book'
    },
    {
      phonem: 'u:',
      word: 'two'
    },
    {
      phonem: 'ɜ:ʳ',
      word: 'shirt'
    },
    {
      phonem: 'ə',
      word: 'father'
    }
  ]

  const diphthongs = [ 
    {
      phonem: 'eɪ',
      word: 'eight'
    },
    {
      phonem: 'aɪ',
      word: 'eye'
    },
    {
      phonem: 'ɔɪ',
      word: 'boy'
    },
    {
      phonem: 'oʊ',
      word: 'arrow'
    },
    {
      phonem: 'aʊ',
      word: 'house'
    },
    {
      phonem: 'eəʳ',
      word: 'chair'
    },
    {
      phonem: 'ɪəʳ',
      word: 'deer'
    },
    {
      phonem: 'ʊə',
      word: 'tourist'
    },
  ]


  const getPhonemList = (items, type) => (
    <div className="phonemSection">
      <p className="title">{type}</p>
      <div className={`phonemList ${type}`}>
        {items.map(({phonem, word})=>
          <div className="pair">
            <span className="phonem">
              {phonem}
            </span>
            <span className="word">
              {word}
            </span>
          </div>
        )}
      </div>
    </div>
  )
  
  return <div className="group">
    {getPhonemList(consonants, 'consonants')}
    <div className="subgroup">
      {getPhonemList(vowels, 'vowels')}
      {getPhonemList(diphthongs, 'diphthongs')}
    </div>
  </div>
}

export default Phonemes