// src/App.tsx
import React, { useState, useEffect } from 'react';
import EvolutionMap from './components/EvolutionMap';
import { evolutionConfig } from './utils/evolutionConfig';

const App: React.FC = () => {
    const [generation, setGeneration] = useState<number>(0);
    const [population, setPopulation] = useState<number>(evolutionConfig.population);

    useEffect(() => {
        // Hier kannst du Logik für den Start der Evolution oder andere Initialisierungen hinzufügen
        // Beispiel: setPopulation(evolutionConfig.population);
    }, []);

    const handleNextGeneration = () => {
        // Hier kannst du Logik für den Übergang zur nächsten Generation hinzufügen
        // Beispiel: Implementiere Reproduktion, Mutation, Selektion
        setGeneration((prevGeneration) => prevGeneration + 1);
    };

    return (
        <div>
            <h1>Evolution Simulation</h1>
            <p>Generation: {generation}</p>
            <button onClick={handleNextGeneration}>Next Generation</button>
            <EvolutionMap population={population} />
        </div>
    );
};

export default App;
