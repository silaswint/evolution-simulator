// src/components/EvolutionMap.tsx
import React, { useState, useEffect } from 'react'
import Creature from './Creature'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { randomIntFromInterval } from '@/utils/random'
import { generateRandomGenome } from '@/utils/genomeUtils'

interface EvolutionMapProps {
  population: number
  secondsLeftForCurrentGeneration: number
  generation: number
}

const EvolutionMap: React.FC<EvolutionMapProps> = ({ population, secondsLeftForCurrentGeneration, generation }) => {
  const [creatures, setCreatures] = useState<JSX.Element[]>([])
  const [position, setPosition] = useState<Record<number, { x: number, y: number }>>({})

  useEffect(() => {
    setPosition(prevPosition => {
      const newPosition: Record<number, { x: number, y: number }> = {}
      for (let i = 0; i < population; i++) {
        newPosition[i] = {
          x: randomIntFromInterval(0, evolutionConfig.mapSize.width),
          y: randomIntFromInterval(0, evolutionConfig.mapSize.height)
        }
      }
      return { ...prevPosition, ...newPosition }
    })
  }, [population])

  useEffect(() => {
    const initialCreatures: JSX.Element[] = []

    for (let i = 0; i < population; i++) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      initialCreatures.push((!!position[i] && <Creature key={i} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} setPosition={setPosition} position={position} id={i} genome={generateRandomGenome()} />))
    }

    setCreatures(initialCreatures)
  }, [population, secondsLeftForCurrentGeneration, generation, evolutionConfig, position])

  // Entferne Kreaturen auf der unteren Hälfte der Karte, wenn secondsLeftForCurrentGeneration den Wert 0 hat
  useEffect(() => {
    if (secondsLeftForCurrentGeneration === 0) {
      setCreatures(creatures.filter((creature) => {
        const creaturePositionY = position[creature.props.id].y
        return creaturePositionY < evolutionConfig.mapSize.height / 2
      }))
    }
  }, [secondsLeftForCurrentGeneration, position])

  return (
        <div style={{ position: 'relative', width: `${evolutionConfig.mapSize.width}px`, height: `${evolutionConfig.mapSize.height}px`, overflow: 'hidden', border: '1px solid red' }}>
            {creatures.map((creature) => creature)}
        </div>
  )
}

export default EvolutionMap
