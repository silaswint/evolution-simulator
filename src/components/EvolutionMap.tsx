// src/components/EvolutionMap.tsx
import React, { useState, useEffect, useRef } from 'react'
import Creature from './Creature'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { randomIntFromInterval } from '@/utils/random'
import { generateRandomGenome } from '@/utils/genomeUtils'

interface EvolutionMapProps {
  secondsLeftRef: React.MutableRefObject<number>
  populationRef: React.MutableRefObject<number>
  generationRef: React.MutableRefObject<number>
}

const EvolutionMap: React.FC<EvolutionMapProps> = ({ secondsLeftRef, populationRef, generationRef }) => {
  const [creatures, setCreatures] = useState<JSX.Element[]>([])
  const [position, setPosition] = useState<Record<number, { x: number, y: number }>>({})
  const [speed, setSpeed] = useState(0)
  const [positionIsLoaded, setPositionIsLoaded] = useState<boolean>(false)

  const speedRef = useRef(speed)
  speedRef.current = speed

  const positionRef = useRef(position)
  positionRef.current = position

  setInterval(() => {
    setSpeed(speed + 1)
  }, evolutionConfig.speedInMs)

  useEffect(() => {
    setPosition((prevPosition) => {
      const newPosition: Record<number, { x: number, y: number }> = {}
      for (let i = 0; i < populationRef.current; i++) {
        newPosition[i] = {
          x: randomIntFromInterval(0, evolutionConfig.mapSize.width),
          y: randomIntFromInterval(0, evolutionConfig.mapSize.height)
        }
      }
      return { ...prevPosition, ...newPosition }
    })
    setPositionIsLoaded(true)
  }, [populationRef])

  useEffect(() => {
    if (!positionIsLoaded) {
      return
    }

    const initialCreatures: JSX.Element[] = []

    for (let i = 0; i < populationRef.current; i++) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!positionRef.current[i]) {
        continue
      }

      initialCreatures.push(
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        <Creature
            key={i}
            secondsLeftRef={secondsLeftRef}
            generationRef={generationRef}
            setPosition={setPosition}
            populationRef={populationRef}
            positionRef={positionRef}
            id={i}
            genome={generateRandomGenome()}
            speedRef={speedRef}
        />
      )
    }

    setCreatures(initialCreatures)
  }, [populationRef, secondsLeftRef, generationRef, positionRef, positionIsLoaded])

  // Entferne Kreaturen auf der unteren Hälfte der Karte, wenn secondsLeftRef den Wert 0 hat
  useEffect(() => {
    if (secondsLeftRef.current === 0) {
      setCreatures((creatures) =>
        creatures.filter((creature) => {
          const creaturePositionY = positionRef.current[creature.props.id].y
          return creaturePositionY < evolutionConfig.mapSize.height / 2
        })
      )
    }
  }, [secondsLeftRef.current, positionRef])

  return (
      <div style={{ position: 'relative', width: `${evolutionConfig.mapSize.width}px`, height: `${evolutionConfig.mapSize.height}px`, overflow: 'hidden', border: '1px solid red' }}>
        {creatures.map((creature) => creature)}
      </div>
  )
}

export default EvolutionMap
