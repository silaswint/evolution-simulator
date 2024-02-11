export interface Ticker {
  add: (callback: () => void) => void
  remove: (callback: () => void) => void
}
