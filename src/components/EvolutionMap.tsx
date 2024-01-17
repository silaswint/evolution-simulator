// src/components/EvolutionMap.tsx
import React, { useState, useEffect } from 'react';
import Creature from './Creature';
import { evolutionConfig } from "@/utils/evolutionConfig";

interface EvolutionMapProps {
    population: number;
}

const EvolutionMap: React.FC<EvolutionMapProps> = ({ population }) => {
    const [creatures, setCreatures] = useState<JSX.Element[]>([]);

    useEffect(() => {
        // Hier könntest du Logik implementieren, um die Kreaturen zu initialisieren
        const initialCreatures: JSX.Element[] = [];

        for (let i = 0; i < population; i++) {
            const initialPosition = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
            };

            initialCreatures.push(<Creature key={i} initialPosition={initialPosition} />);
        }

        setCreatures(initialCreatures);
    }, [population]);

    return (
        <div style={{ position: 'relative', width: `${evolutionConfig.mapSize.width}px`, height: `${evolutionConfig.mapSize.height}px`, overflow: 'hidden', border: '1px solid red' }}>
            {creatures.map((creature) => creature)}
        </div>
    );
};

export default EvolutionMap;
