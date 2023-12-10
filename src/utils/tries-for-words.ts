class TrieNode {
  endOfWord: boolean;
  children: Array<TrieNode>;

  constructor() {
    this.endOfWord = false;
    this.children = new Array(26);
  }
}

export class Trie {
  root: TrieNode;
  words: string[] = [];

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    let curNode = this.root;
    let index: number;
    for (let i = 0; i < word.length; i++) {
      index = word[i].charCodeAt(0) - 'a'.charCodeAt(0);
      if (!curNode.children[index]) curNode.children[index] = new TrieNode();
      curNode = curNode.children[index];
    }
    curNode.endOfWord = true;
  }

  getAllWords() {
    const words: string[] = [];
    this.dfs(this.root, [], words);
    this.words = words;
    return words;
  }

  search(prefix: string): null | string[] {
    let curNode = this.root;
    let index: number;
    const words: string[] = [];
    for (let i = 0; i < prefix.length; i++) {
      index = prefix[i].charCodeAt(0) - 'a'.charCodeAt(0);
      if (!curNode.children[index]) return null;
      curNode = curNode.children[index];
    }

    this.dfs(curNode, [...prefix], words);

    return words;
  }

  suggest(prefix: string) {
    let curNode = this.root;
    let index: number;
    for (let i = 0; i < prefix.length; i++) {
      index = prefix[i].charCodeAt(0) - 'a'.charCodeAt(0);
      if (!curNode.children[index]) return null;

      curNode = curNode.children[index];
    }

    return this.suggestDfs(curNode, [...prefix]);
  }

  private dfs(root: TrieNode, word: Array<string>, words: string[]) {
    if (!root) return;

    if (root.endOfWord) words.push(word.join(''));

    for (let i = 0; i < root.children.length; i++) {
      const char = String.fromCharCode(i + 'a'.charCodeAt(0));
      word.push(char);
      this.dfs(root.children[i], word, words);
      word.pop();
    }
  }

  private suggestDfs(root: TrieNode, word: string[]): undefined | string {
    if (!root) return;

    let index = -1;
    for (let i = 0; i < root.children.length; i++) {
      if (root.children[i]) {
        index = i;
        break;
      }
    }
    const char = String.fromCharCode(index + 'a'.charCodeAt(0));
    word.push(char);
    if (root.children[index] && root.children[index].endOfWord) return word.join('');

    return this.suggestDfs(root.children[index], word);
  }
}
