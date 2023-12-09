import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import debounce from 'lodash/debounce';

import { Trie } from './utils/tries-for-words';

function App() {
  const [words, setWords] = useState<string[] | null>([]);
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    e.target.value = text;
    if (text) setAutoSuggest(trie.suggest(text));
    else setAutoSuggest(null);
    setWords(() => trie.search(text));
  };

  const debouncedOnChange = debounce(onChangeHandler, 100);

  const acceptSuggestion = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == ' ' && words?.length && autoSuggest) {
      e.currentTarget.value = autoSuggest;
    }
  };

  if (loading) {
    return <p>Please wait!! Words are getting loaded for you...</p>;
  }

  return (
    <>
      <input
        type='text'
        placeholder='search any word...'
        onChange={debouncedOnChange}
        onKeyDown={acceptSuggestion}
      />
      {autoSuggest ? (
        <p>May be you are searching this- {autoSuggest}. Press space to accept it.</p>
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
          width={400}>
          {Row}
        </List>
      )}
    </>
  );
}

function Row(props: { index: number; style: React.CSSProperties; data: string[] }) {
  const { data, index, style } = props;
  return <div style={style}>{data[index]}</div>;
}

export default App;
