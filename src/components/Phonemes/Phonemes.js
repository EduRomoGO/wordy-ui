import React from 'react'
import './Phonemes.css';

const Phonemes = () =>{
  const consonants = ['p', 'b', 'd', 't','p', 'b', 'd', 't','p', 'b', 'd', 't',
   'p', 'b', 'd', 't','p', 'b', 'd', 't', 'p', 'b', 'd', 't']
  const vowels = ['p', 'b', 'd', 't','p', 'b', 'd', 't','p', 'b', 'd', 't']
  const diphthongs = ['p', 'b', 'd', 't','p', 'b', 'd', 't']
  
  const getPhonemList = (phonemes, type) => (
    <div className="phonemSection">
      <p className="title">{type}</p>
      <div className={`phonemList ${type}`}>
        {phonemes.map((phonem)=>
          <div className="pair">
            <span className="phonem">
              {phonem}
            </span>
            <span className="word">
              word
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