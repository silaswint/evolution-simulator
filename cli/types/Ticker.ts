import type React from 'react'

export interface Ticker {
  add: (callback: () => void) => void
  remove: (callback: () => void) => void
  stepsPerTicker: React.MutableRefObject<number>
}
