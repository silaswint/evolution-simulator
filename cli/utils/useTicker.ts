import type React from 'react'
import { useEffect, useRef } from 'react'
import { type Ticker } from '@/cli/types/Ticker'

export const useTicker = (maxFPS: number): Ticker => {
  const callbacksRef: React.MutableRefObject<Array<() => void>> = useRef([])
  const intervalRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null)

  const addCallback = (callback: () => void): void => {
    callbacksRef.current = [...callbacksRef.current, callback]
  }

  const removeCallback = (callback: () => void): void => {
    callbacksRef.current = callbacksRef.current.filter((cb) => cb !== callback)
  }

  const tick = (): void => {
    callbacksRef.current.forEach((callback) => {
      callback()
    })
  }

  useEffect(() => {
    intervalRef.current = setInterval(tick, 1000 / maxFPS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [maxFPS])

  return { add: addCallback, remove: removeCallback }
}
