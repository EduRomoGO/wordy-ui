import React, { useState } from 'react';
import './App.css';
import Words from './components/Words/Words.js';

// [ ] Crear web con todas las palabras de mi bbdd de palabras
// [ ] Ver como hacer para que se cacheen los audios, ya que seria una web bastante pesada
// [ ] Crear buscador que puedas introducir cualquier texto, y ordene esas palabras en los resultados de busqueda y oculte las demas palabras que no esten en el texto. Ademas cada palabra tendra a continuacion su phonetica es decir: run (phon) through (phon)... y al hacer hover se escuchara la pronunciacion de cada palabra

// import { pipe, when } from 'ramda';

const descriptors = [
  {
      "word": "school",
      "phonemics": "/ˈskuːl/",
  },
  {
      "word": "bakery",
      "phonemics": "/ˈbeɪkəri/",
  },
  {
      "word": "bus",
      "phonemics": "/ˈskuːl/",
  },
  {
      "word": "window",
      "phonemics": "/ˈbeɪkəri/",
  },
];

function App() {
  const [search, setSearch] = useState('');

  const handleChange = e => setSearch(e.target.value);

  const getDescriptors = () => {
    if (search.length > 0) {
      const allWords = descriptors.map(item => item.word);
      const inputWords = search.split(' ').filter(item => !!item).filter(item => allWords.includes(item));
      const filtered = descriptors.filter(item => inputWords.includes(item.word));
      const ordered = inputWords.map(input => filtered.find(filteredItem => filteredItem.word === input));

      return ordered;
    } else {
      return descriptors;
    }
  };

  return (
    <div className="App">
      <input value={search} onChange={handleChange} />
      <Words words={getDescriptors()} isFilterActive={search.length > 0} />
    </div>
  );
}

export default App;
