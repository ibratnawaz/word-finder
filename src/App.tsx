import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

import { Trie } from './utils/tries-for-words';
import './App.css';

function App() {
  const [words, setWords] = useState<string[] | null>([]);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSuggest, setAutoSuggest] = useState<string | null | undefined>(null);
  const { current: trie } = useRef(new Trie());

  useEffect(() => {
    import('./utils/words.json').then((data) => {
      for (const key in data) {
        trie.insert(key);
      }

      setWords(() => trie.getAllWords());
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let timeoutId: number;
    if (searchText != null) {
      timeoutId = setTimeout(() => {
        setWords(() => trie.search(searchText || ''));
      }, 100);
    }

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    if (text) setAutoSuggest(trie.suggest(text));
    else setAutoSuggest(null);
    setSearchText(text);
  };

  const acceptSuggestion = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'ArrowRight' && words?.length && autoSuggest) {
      setSearchText(autoSuggest);
    }
  };

  if (loading) {
    return <p>Please wait!! Words are getting loaded for you...</p>;
  }

  return (
    <div className='main-container'>
      <input
        type='text'
        placeholder='search any word...'
        value={searchText || ''}
        onChange={onChangeHandler}
        onKeyDown={acceptSuggestion}
      />
      {autoSuggest ? (
        <p>May be you are searching this- {autoSuggest}. Press right arrow (➡️) to accept it.</p>
      ) : null}

      {!words ? (
        <p>Oops!! Looks like no such word is born yet...</p>
      ) : (
        <List
          height={500}
          itemData={words}
          itemCount={words?.length}
          itemSize={20}
          useIsScrolling
          className='list'
          width={400}>
          {Row}
        </List>
      )}
    </div>
  );
}

function Row(props: { index: number; style: React.CSSProperties; data: string[] }) {
  const { data, index, style } = props;
  return <div style={style}>{data[index]}</div>;
}

export default App;