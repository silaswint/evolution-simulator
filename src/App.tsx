import { Stage } from '@pixi/react'
import React, { useEffect, useState } from 'react'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { Map } from '@/components/Map'
import { type SpriteState } from '@/utils/types/SpriteState'
import SpriteModal from './components/SpriteModal'

const mapSize = evolutionConfig.mapSize
const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population, setPopulation] = useState<number>(evolutionConfig.population)
  const [secondsPerGeneration, setSecondsPerGeneration] = useState<number>(evolutionConfig.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedSprite, setSelectedSprite] = useState<SpriteState | null>(null)

  useEffect(() => {
    // Hier kannst du Logik für den Start der Evolution oder andere Initialisierungen hinzufügen
    // Beispiel: setPopulation(evolutionConfig.population);

    // Initialisiere die verbleibenden Sekunden für die aktuelle Generation
    setSecondsLeftForCurrentGeneration(secondsPerGeneration)

    // Starte den Timer, um die verbleibenden Sekunden zu aktualisieren
    const timerInterval = setInterval(() => {
      setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
    }, 1000)

    // Cleanup-Funktion für die Aufhebung des Intervalls beim Entfernen der Komponente
    return () => {
      clearInterval(timerInterval)
    }
  }, [secondsPerGeneration])

  const handleNextGeneration = (): void => {
    // Hier kannst du Logik für den Übergang zur nächsten Generation hinzufügen
    // Beispiel: Implementiere Reproduktion, Mutation, Selektion
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
