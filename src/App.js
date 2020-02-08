import React, { useState } from 'react';
import './App.css';
import Words from './components/Words/Words.js';
import NavMenu from './components/NavMenu/NavMenu.js';
import Phonemes from './components/Phonemes/Phonemes.js';
import Spell from './components/Spell/Spell.js';
import db from './utils/db/db.json';
import Hotkeys from 'react-hot-keys';
import { ReactComponent as CancelIcon } from './SVG/cancel.svg';

// [ ] Ver como hacer para que se cacheen los audios, ya que seria una web bastante pesada
// [ ] Las palabras que no encuentre, en lugar de filtrarlas, marcarlas para pintarlas en rojo 
// [ ] Crear seccion spell con el abecedario
// [ ] Mejorar los estilos del input de busqueda

function App() {
  const [search, setSearch] = useState('');
  const [initialWordNumber, setInitialWordNumber] = useState(0);
  const [menuItemSelected, setMenuItemSelected] = useState('words');

  const handleChange = e => setSearch(e.target.value);

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

  const getInputWords = search => {
    const leaveOnlyLetters = str => str.replace(/[^A-Za-z\s]/g, '');

    const inputWords = leaveOnlyLetters(search)
      .toLowerCase()
      .split(' ')
      .filter(item => !!item);

    return inputWords;
  };

  const getDescriptors = () => {
    const allDescriptors = db.wordDescriptors
      .map(item => ({ word: item.word, phonemics: item.phonemics }));
    // .map(item => ({ word: item.word, phonemics: item.phonemics }))
    // .slice(0, 40);

    let descriptors = [allDescriptors];

    if (search.length > 0) {
      const allWords = allDescriptors.map(item => item.word);

      const inputWords = getInputWords(search)
        .filter(item => allWords.includes(item));
      const filtered = allDescriptors.filter(item => inputWords.includes(item.word));
      const ordered = inputWords.map(input => filtered.find(filteredItem => filteredItem.word === input));

      descriptors.push(ordered);
    }

    return descriptors;
  };

  const getDefinition = () => {
    let definition = '';

    if (isFilterActive()) {
      const allDescriptors = db.wordDescriptors;
      const inputWords = getInputWords(search);
      
      if (inputWords.length === 1) {
        const word = allDescriptors.find(item => item.word === inputWords[0]);

        definition = word ? word.definitions[0].defs[0].def : '';
      }
    }

    return definition;
  };

  const isFilterActive = () => search.length > 0;

  const getFilteredWords = () => {
    if (isFilterActive()) {
      return <Words words={getDescriptors()[1]} isFilterActive={isFilterActive()} />
    }
  }

  const handleInitialWordNumberChange = (e) => setInitialWordNumber(e.target.value);

  const onKeyDown = (keyName) => {
    const keyMap = {
      // h for hunt (hunt a word, fun pun)
      'Command+h': () => document.querySelector('input').focus(),
      'alt+p': () => handlePlayClick(),
    }

    keyMap[keyName]();
  };


  const renderWords = () => {
    return <Hotkeys
      keyName="Command+h,alt+p"
      onKeyDown={onKeyDown}
    >
      <div className='search-wrapper'>
        <input className='search' value={search} onChange={handleChange} placeholder='Command+h to focus' />
        <CancelIcon />
      </div>
      <button onClick={handlePlayClick}>Play Search (alt+p)</button>
      <button onClick={handleClearClick}>Clear Search</button>
      <section className='starting-word-section'>
        <p>Initial word number:</p>
        <input onChange={handleInitialWordNumberChange} className='starting-word' value={initialWordNumber} />
      </section>
      {getFilteredWords()}
      <div>{getDefinition()}</div>
      <Words words={getDescriptors()[0].slice(parseInt(initialWordNumber, 10), parseInt(initialWordNumber, 10) + 50)} hidden={isFilterActive()} />
    </Hotkeys>
  };

  const renderMenuItem = menuItemSelected => {
    if (menuItemSelected === 'words') {
      return renderWords();
    } else if (menuItemSelected === 'phonemes') {
      return <Phonemes />;
    } else if (menuItemSelected === 'spell') {
      return <Spell />;
    }
  };

  return (
    <div className="App">
      <NavMenu
        listOfItems={['words', 'phonemes', 'spell']}
        action={(item) => setMenuItemSelected(item)}
        state={menuItemSelected}
      />
      {renderMenuItem(menuItemSelected)}
    </div>
  );
}

export default App;
