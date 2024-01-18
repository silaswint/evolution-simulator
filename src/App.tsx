// src/App.tsx
import React, { useState, useEffect, useRef } from 'react'
import EvolutionMap from './components/EvolutionMap'
import { evolutionConfig } from './utils/evolutionConfig'

const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population, setPopulation] = useState<number>(evolutionConfig.population)
  const [secondsPerGeneration, setSecondsPerGeneration] = useState<number>(evolutionConfig.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)

  // Verwende useRef, um den aktuellen Wert von secondsLeftForCurrentGeneration zu speichern
  const secondsLeftRef = useRef(secondsLeftForCurrentGeneration)
  secondsLeftRef.current = secondsLeftForCurrentGeneration

  const populationRef = useRef(population)
  populationRef.current = population

  const generationRef = useRef(generation)
  generationRef.current = generation

  useEffect(() => {
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
        <div>
            <h1>Evolution Simulation</h1>
            <p>Generation: {generation}</p>
            <p>Seconds left for current generation: {secondsLeftForCurrentGeneration}</p>
            <button onClick={handleNextGeneration}>Next Generation</button>
            <EvolutionMap secondsLeftRef={secondsLeftRef} populationRef={populationRef} generationRef={generationRef} />
        </div>
  )
}

export default App
