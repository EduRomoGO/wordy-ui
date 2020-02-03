import React from 'react'
import './Phonemes.css';

const Phonemes = () =>{
  const consonants = ['p', 'b', 't', 'd','k', 'g', 'm', 'n','ŋ', 'f', 'v', 'θ',
  'ð', 's', 'z', 'ʃ','ʒ', 'h', 'tʃ', 'dʒ', 'r', 'l', 'j', 'w']
  const vowels = ['i:','ɪ','e','æ', 'ɑ:', 'ʌ','ɒ','ɔ:','ʊ','u:','ɜ:ʳ','ə']
  const diphthongs = ['p', 'b', 'd', 't','p', 'b', 'd', 't']
  
  const consonantsWords = ['soup', 'bat', 'light', 'dog','cap', 'bag', 'man', 'rain','king', 'fish', 'van', 'thumb','mother', 'mouse', 'zebra', 'shoe','television', 'hand', 'cheese', 'jet', 'write', 'long', 'yo-yo', 'whale']
  const vowelsWords = [ 'sea','swim','bed','cat', 'car', 'cup','lock','ball','book','two','shirt','father']
  const diphthongsWords = ['eight','eye','boy','arrow','house','chair','deer','tourist']

  const getPhonemList = (phonemes, type, words) => (
    <div className="phonemSection">
      <p className="title">{type}</p>
      <div className={`phonemList ${type}`}>
        {phonemes.map((phonem, index)=>
          <div className="pair">
            <span className="phonem">
              {phonem}
            </span>
            <span className="word">
              {words[index]}
            </span>
          </div>
        )}
      </div>
    </div>
  )
  
  return <div className="group">
    {getPhonemList(consonants, 'consonants', consonantsWords)}
    <div className="subgroup">
      {getPhonemList(vowels, 'vowels', vowelsWords)}
      {getPhonemList(diphthongs, 'diphthongs', diphthongsWords)}
    </div>
  </div>
}

export default Phonemes