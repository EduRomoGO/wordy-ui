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

  const handleOnMouseOver = (e, file) => {
    document.querySelector(`#${file}`).play();
  };

  const getPhonemList = (items, type) => (
    <div className="phonemSection">
      <p className="title">{type}</p>
      <div className={`phonemList ${type}`}>
        {items.map(({ phonem, word })=> {
          const newPhonem = phonem.includes(':') ? phonem.replace(":", "\\:") : phonem
          return (  
          <div className="pair">
            <span 
              className="phonem" 
              onMouseOver={(e)=>handleOnMouseOver(e, newPhonem)}
              onClick={(e)=>handleOnMouseOver(e, newPhonem)}
            >
              {phonem}
            </span>
            <audio hidden={false} id={phonem} controls>
              <source src={`./phonemesFiles/${phonem}.mp3`} type="audio/mpeg"></source>
              Your browser does not support the audio element.
            </audio>
            <span 
              className="word"
              onMouseOver={(e)=>handleOnMouseOver(e, word)}
              onClick={(e)=>handleOnMouseOver(e, word)}
            >
              {word}
            </span>
            <audio hidden={false} id={word} controls>
              <source src={`./phonemesFiles/${word}.mp3`} type="audio/mpeg"></source>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
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