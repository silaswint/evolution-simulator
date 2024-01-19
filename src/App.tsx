import { Stage } from '@pixi/react'
import React, { useEffect, useState } from 'react'
import { config } from '@/utils/config'
import { Hamsters } from '@/components/Hamsters'
import { type HamsterState } from '@/utils/types/HamsterState'
import HamsterModal from './components/HamsterModal'

const mapSize = config.mapSize
const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population, setPopulation] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedHamster, setSelectedHamster] = useState<HamsterState | null>(null)

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
              <Hamsters population={population} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} setSelectedHamster={setSelectedHamster} />
          </Stage>
          <HamsterModal selectedHamster={selectedHamster} setSelectedHamster={setSelectedHamster} />
      </>
  )
}

export default App
