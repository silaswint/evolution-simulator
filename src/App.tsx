// src/App.tsx
import React, { useState, useEffect } from 'react';
import EvolutionMap from './components/EvolutionMap';
import { evolutionConfig } from './utils/evolutionConfig';

const App: React.FC = () => {
    const [generation, setGeneration] = useState<number>(0);
    const [population, setPopulation] = useState<number>(evolutionConfig.population);
    const [secondsPerGeneration, setSecondsPerGeneration] = useState<number>(evolutionConfig.secondsPerGeneration);
    const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration);

    useEffect(() => {
        // Hier kannst du Logik für den Start der Evolution oder andere Initialisierungen hinzufügen
        // Beispiel: setPopulation(evolutionConfig.population);

        // Initialisiere die verbleibenden Sekunden für die aktuelle Generation
        setSecondsLeftForCurrentGeneration(secondsPerGeneration);

        // Starte den Timer, um die verbleibenden Sekunden zu aktualisieren
        const timerInterval = setInterval(() => {
            setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1));
        }, 1000);

        // Cleanup-Funktion für die Aufhebung des Intervalls beim Entfernen der Komponente
        return () => clearInterval(timerInterval);
    }, [secondsPerGeneration]);

    const handleNextGeneration = () => {
        // Hier kannst du Logik für den Übergang zur nächsten Generation hinzufügen
        // Beispiel: Implementiere Reproduktion, Mutation, Selektion
        setGeneration((prevGeneration) => prevGeneration + 1);
    };

    return (
        <div>
            <h1>Evolution Simulation</h1>
            <p>Generation: {generation}</p>
            <p>Seconds left for current generation: {secondsLeftForCurrentGeneration}</p>
            <button onClick={handleNextGeneration}>Next Generation</button>
            <EvolutionMap population={population} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} />
        </div>
    );
};

export default App;
