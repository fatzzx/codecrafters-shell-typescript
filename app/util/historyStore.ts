const history: string[] = [];
let savedIndex = 0;

export function addHistory(cmd: string) {
  history.push(cmd);
}

export function getHistory() {
  return history;
}

export function getNewHistory() {
  return history.slice(savedIndex);
}

export function markHistorySaved() {
  savedIndex = history.length;
}
