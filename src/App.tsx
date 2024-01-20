import { Stage } from '@pixi/react'
import React, { useEffect, useState } from 'react'
import { config } from '@/utils/config'
import { Hamsters } from '@/components/Hamsters'
import { type HamsterState } from '@/utils/types/HamsterState'
import HamsterModal from './components/HamsterModal'
import fileDownload from 'js-file-download'
import { generateRandomHamsters } from '@/utils/generateRandomHamsters'
import { genomeToHex } from '@/utils/genome'

const mapSize = config.mapSize
const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedHamster, setSelectedHamster] = useState<HamsterState | null>(null)
  const [survivingPopulation, setSurvivingPopulation] = useState<number>(config.population)
  const [hamsters, setHamsters] = useState<HamsterState[]>(generateRandomHamsters(population))

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
  }, [secondsPerGeneration, generation])

  const resetGenerationCountdown = (): void => {
    setSecondsLeftForCurrentGeneration(config.secondsPerGeneration)
  }

  const downloadGeneration = (): void => {
    fileDownload(JSON.stringify(hamsters.map(hamster => genomeToHex(hamster.genome))), 'generation.json')
  }

  return (
      <>
          <h1>Evolution Simulation</h1>
          <p>Generation: {generation}</p>
          <p>Seconds left for current generation: {secondsLeftForCurrentGeneration}</p>
          <p>Surviving population: {survivingPopulation} / {config.population}</p>
          <p>Download current generation of hamsters:
              <button onClick={() => {
                downloadGeneration()
              }}>Download</button>
          </p>
          <br />
          <br />
          <Stage width={mapSize.width} height={mapSize.height} options={{ backgroundColor: 0xeef1f5 }}>
              <Hamsters population={population} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} setSelectedHamster={setSelectedHamster} resetGenerationCountdown={resetGenerationCountdown} setGeneration={setGeneration} setSurvivingPopulation={setSurvivingPopulation} hamsters={hamsters} setHamsters={setHamsters}/>
          </Stage>
          <HamsterModal selectedHamster={selectedHamster} setSelectedHamster={setSelectedHamster} />
      </>
  )
}

export default App
