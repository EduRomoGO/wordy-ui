import React, { useState } from 'react';
import './App.css';
import Words from './components/Words/Words.js';
import db from './utils/db/db.json';
import Hotkeys from 'react-hot-keys';

// [ ] Ver como hacer para que se cacheen los audios, ya que seria una web bastante pesada
// [ ] Limitar el numero de items que se pintan en pantalla a 200 o algo asi, o que se vayan pintando poco a poco
// [x] Mejorar el aspecto y la usabilidad del texto buscado

function App() {
  const [search, setSearch] = useState('');

  const leaveOnlyLetters = str => str.replace(/[^A-Za-z\s]/g, '');
  const handleChange = e => setSearch(leaveOnlyLetters(e.target.value.toLowerCase()));

  const handleClearClick = () => setSearch('');
  const handlePlayClick = () => {
    if (isFilterActive()) {
      let timeout = 0;

      [...document.querySelector('.words-short').querySelectorAll('audio')].forEach(audio => {
        setTimeout(() => {
          audio.play();
        }, timeout * 1000);
        
        timeout += audio.duration;
      });
    }
  }

  const getDescriptors = () => {
    const allDescriptors = db.wordDescriptors
      .map(item => ({ word: item.word, phonemics: item.phonemics }));
      // .map(item => ({ word: item.word, phonemics: item.phonemics }))
      // .slice(0, 40);

    let descriptors = [allDescriptors];

    if (search.length > 0) {
      const allWords = allDescriptors.map(item => item.word);
      const inputWords = search.split(' ').filter(item => !!item).filter(item => allWords.includes(item));
      const filtered = allDescriptors.filter(item => inputWords.includes(item.word));
      const ordered = inputWords.map(input => filtered.find(filteredItem => filteredItem.word === input));

      descriptors.push(ordered);
    }

    return descriptors;
  };

  const isFilterActive = () => search.length > 0;

  const getFilteredWords = () => {
    if (isFilterActive()) {
      return <Words words={getDescriptors()[1]} isFilterActive={isFilterActive()} />
    }
  }

  const knowledge = 0;

  const onKeyDown = (keyName) => {
    const keyMap = {
      // h for hunt (hunt a word, fun pun)
      'Command+h': () => document.querySelector('input').focus(),
      'alt+p': () => handlePlayClick(),
    }

    keyMap[keyName]();
  };  

  return (
    <div className="App">
      <Hotkeys 
        keyName="Command+h,alt+p" 
        onKeyDown={onKeyDown}
      >
        <input value={search} onChange={handleChange} placeholder='Command+h to focus' />
        <button onClick={handleClearClick}>Clear Search</button>
        <button onClick={handlePlayClick}>Play Search</button>
        {getFilteredWords()}
        <Words words={getDescriptors()[0].slice(knowledge, knowledge + 50)} hidden={isFilterActive()} />
      </Hotkeys>
    </div>
  );
}

export default App;
