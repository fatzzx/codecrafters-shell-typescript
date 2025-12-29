const history: string[] = [];

export function addHistory(cmd: string) {
  history.push(cmd);
}

export function getHistory() {
  return history;
}
