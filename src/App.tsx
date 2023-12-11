import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window';

import { Trie } from './utils/tries-for-words';
import './App.css';

function App() {
  const [words, setWords] = useState<string[] | null>([]);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSuggest, setAutoSuggest] = useState<string | null | undefined>(null);
  const { current: trie } = useRef(new Trie());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listRef = useRef<any>(null);

  useEffect(() => {
    window.requestIdleCallback(() => {
      fetch('./assets/words.json')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          for (const key in data) {
            trie.insert(key);
          }

          setWords(() => trie.getAllWords());
          setLoading(false);
        })
        .catch((e: Error) => {
          console.log(e.message);
        });
    });
  }, []);

  useEffect(() => {
    let timeout!: number;
    if (timeout) clearTimeout(timeout);

    if (searchText != null) {
      timeout = setTimeout(() => {
        if (searchText) setWords(() => trie.search(searchText));
        else if (searchText == '') setWords(trie.words);

        listRef?.current?.scrollTo(0, 0);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [searchText]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim().toLowerCase();
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
          ref={listRef}
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

function Row(props: ListChildComponentProps<string[]>) {
  const { data, index, style, isScrolling } = props;
  if (isScrolling) {
    return (
      <div style={style} className='list-box loading'>
        ...
      </div>
    );
  }

  return (
    <div style={style} className='list-box'>
      {data[index]}
    </div>
  );
}

export default App;
