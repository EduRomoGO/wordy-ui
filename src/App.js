import React, { useState } from 'react';
import './App.css';
import Words from './components/Words/Words.js';
import db from './utils/db/db.json';

// [ ] Ver como hacer para que se cacheen los audios, ya que seria una web bastante pesada
// [ ] Limitar el numero de items que se pintan en pantalla a 200 o algo asi, o que se vayan pintando poco a poco
// [ ] Mejorar el aspecto y la usabilidad del texto buscado

function App() {
  const [search, setSearch] = useState('');

  const handleChange = e => setSearch(e.target.value.toLowerCase());

  const handleClearClick = () => setSearch('');

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

  return (
    <div className="App">
      <input value={search} onChange={handleChange} />
      <button onClick={handleClearClick}>Clear Search</button>
      {getFilteredWords()}
      <Words words={getDescriptors()[0].slice(0, 100)} hidden={isFilterActive()} />
    </div>
  );
}

export default App;
