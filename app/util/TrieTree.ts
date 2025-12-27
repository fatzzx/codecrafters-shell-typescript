class TreeNode {
  children: Map<string, TreeNode>;
  end: boolean;
  constructor() {
    this.children = new Map<string, TreeNode>();
    this.end = false;
  }
}

export class Trie {
  root: TreeNode;

  constructor() {
    this.root = new TreeNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TreeNode());
      node = node.children.get(c)!;
    }
    node.end = true;
  }

  startsWith(prefix: string): string[] {
    let node = this.root;
    for (const c of prefix) {
      if (!node.children.has(c)) return [];
      node = node.children.get(c)!;
    }
    let wordsList: string[] = [];

    const collectWords = (currentNode: TreeNode, currentWord: string) => {
      if (currentNode.end) {
        wordsList.push(currentWord);
      }

      for (const [c, n] of currentNode.children) {
        collectWords(n, currentWord + c);
      }
    };
    collectWords(node, prefix);

    return wordsList;
  }

  findLongestCommonPrefix(prefix: string): string {
    let node = this.root;
    for (const c of prefix) {
      if (!node.children.has(c)) return prefix;
      node = node.children.get(c)!;
    }

    let lcp = prefix;
    while (true) {
      if (node.end) break;
      if (node.children.size !== 1) break;
      const [char, nextNode] = node.children.entries().next().value!;
      lcp += char;
      node = nextNode;
    }
    return lcp;
  }
}
