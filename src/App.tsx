import { Stage } from '@pixi/react'
import React, { useEffect, useState } from 'react'
import { config } from '@/utils/config'
import { Map } from '@/components/Map'
import { type SpriteState } from '@/utils/types/SpriteState'
import SpriteModal from './components/SpriteModal'

const mapSize = config.mapSize
const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population, setPopulation] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedSprite, setSelectedSprite] = useState<SpriteState | null>(null)

  useEffect(() => {
    setSecondsLeftForCurrentGeneration(secondsPerGeneration)

    // Start the timer to update the remaining seconds
    const timerInterval = setInterval(() => {
      setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
    }, 1000)

    // Cleanup function for canceling the interval when removing the component
    return () => {
      clearInterval(timerInterval)
    }
  }, [secondsPerGeneration])

  const handleNextGeneration = (): void => {
    setGeneration((prevGeneration) => prevGeneration + 1)
  }

  return (
      <>
          <h1>Evolution Simulation</h1>
          <p>Generation: {generation}</p>
          <p>Seconds left for current generation: {secondsLeftForCurrentGeneration}</p>
          <button onClick={handleNextGeneration}>Next Generation</button>
          <br />
          <br />
          <Stage width={mapSize.width} height={mapSize.height} options={{ backgroundColor: 0xeef1f5 }}>
              <Map population={population} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} setSelectedSprite={setSelectedSprite} />
          </Stage>
          <SpriteModal selectedSprite={selectedSprite} setSelectedSprite={setSelectedSprite} />
      </>
  )
}

export default App
