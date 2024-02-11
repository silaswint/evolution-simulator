import type React from 'react'
import { useEffect, useRef } from 'react'
import { type Ticker } from '@/cli/types/Ticker'

export const useTicker = (maxFPS: number): Ticker => {
  const callbacksRef: React.MutableRefObject<Array<() => void>> = useRef([])
  const intervalRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null)
  const isRunningRef: React.MutableRefObject<boolean> = useRef(false)
  const stepsPerTicker: React.MutableRefObject<number> = useRef(0)

  const addCallback = (callback: () => void): void => {
    callbacksRef.current = [...callbacksRef.current, callback]
  }

  const removeCallback = (callback: () => void): void => {
    callbacksRef.current = callbacksRef.current.filter((cb) => cb !== callback)
  }

  const tick = (): void => {
    if (!isRunningRef.current) {
      isRunningRef.current = true

      callbacksRef.current.forEach((callback) => {
        callback()
      })

      isRunningRef.current = false
      stepsPerTicker.current++
    }
  }

  useEffect(() => {
    stepsPerTicker.current = 0
    intervalRef.current = setInterval(tick, 1)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { add: addCallback, remove: removeCallback, stepsPerTicker }
}
