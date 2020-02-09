import React, { useState } from 'react';
import './App.css';
import Words from './components/Words/Words.js';
import NavMenu from './components/NavMenu/NavMenu.js';
import Phonemes from './components/Phonemes/Phonemes.js';
import Spell from './components/Spell/Spell.js';
import db from './utils/db/db.json';
import Hotkeys from 'react-hot-keys';
import { ReactComponent as CancelIcon } from './SVG/cancel.svg';
import {DebounceInput} from 'react-debounce-input';

// [ ] Ver como hacer para que se cacheen los audios, ya que seria una web bastante pesada
// [ ] Las palabras que no encuentre, en lugar de filtrarlas, marcarlas para pintarlas en rojo
// [ ] Mejorar los estilos del input de busqueda

function App() {
  const [search, setSearch] = useState({
    input: '',
    inputWords: [],
  });
  const [definition, setDefinition] = useState({
    word: '',
    definition: '',
  });
  const [initialWordNumber, setInitialWordNumber] = useState(0);
  const [menuItemSelected, setMenuItemSelected] = useState('words');

  const handleClearClick = () => {
    setSearch({ input: '', inputWords: [] });
    setDefinition({word: '', definition: ''});
  }
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

  const getAllDescriptors = () => {
    return db.wordDescriptors
      .map(item => ({ word: item.word, phonemics: item.phonemics }));
    // .map(item => ({ word: item.word, phonemics: item.phonemics }))
    // .slice(0, 40);
  };

  const handleChange = e => {
    const allDescriptors = getAllDescriptors();
    const allWords = allDescriptors.map(item => item.word);

    const existingInputWords = getInputWords(e.target.value)
      .filter(item => allWords.includes(item));
    const existingInputWordDescriptors = allDescriptors.filter(item => existingInputWords.includes(item.word));
    const orderedInputWordsDescriptors = existingInputWords.map(input => existingInputWordDescriptors.find(n => n.word === input));

    if (existingInputWords.length === 1) {
      setDefinition({word: existingInputWords[0], definition: getDefinition(existingInputWords[0])});
    } else {
      setDefinition({word: '', definition: ''});
    }

    setSearch(search => ({
      ...search,
      inputWords: orderedInputWordsDescriptors,
      input: e.target.value,
    }));
  };

  const getDefinition = word => {
    const allDescriptors = db.wordDescriptors;
    const wordDescriptor = allDescriptors.find(item => item.word === word);

    return wordDescriptor ? wordDescriptor.definitions[0].defs[0].def : '';
  };

  const isFilterActive = () => search.input.length > 0;

  const getFilteredWords = () => {
    if (isFilterActive()) {
      return <Words words={search.inputWords} isFilterActive={isFilterActive()} />
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

  const handleWordClick = word => {
    setDefinition({word, definition: getDefinition(word)});
  }

  const renderDefinition = ({word, definition}) => {
    return word && definition ? <div>{word} - {definition}</div> : '';
  }


  const renderWords = () => {
    return <Hotkeys
      keyName="Command+h,alt+p"
      onKeyDown={onKeyDown}
    >
      <article className='b-search'>
        <div className='b-search__wrapper'>
          <label htmlFor='search' hidden>Search</label>
          <DebounceInput id='search' debounceTimeout={300} className='b-search__input' value={search.input} onChange={handleChange} placeholder='Command+h to focus' />
          <CancelIcon className='b-search__cancel' tabIndex='0' onKeyPress={handleClearClick} onClick={handleClearClick} />
        </div>
      </article>
      <button onClick={handlePlayClick}>Play Search (alt+p)</button>
      {getFilteredWords()}
      {renderDefinition(definition)}
      <section className='starting-word-section'>
        <p>Initial word number:</p>
        <input onChange={handleInitialWordNumberChange} className='starting-word' value={initialWordNumber} />
      </section>
      <Words onClick={handleWordClick} words={getAllDescriptors().slice(parseInt(initialWordNumber, 10), parseInt(initialWordNumber, 10) + 50)} hidden={isFilterActive()} />
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
