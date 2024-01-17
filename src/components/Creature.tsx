// src/components/Creature.tsx
import React, { useState, useEffect } from 'react';
import { generateRandomGenome } from '@/utils/genomeUtils';
import { evolutionConfig } from '@/utils/evolutionConfig';

interface CreatureProps {
    initialPosition: { x: number; y: number };
}

const Creature: React.FC<CreatureProps> = ({ initialPosition }) => {
    const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition);
    const [genome, setGenome] = useState<string>(generateRandomGenome(evolutionConfig.genomeSize));

    useEffect(() => {
        // Hier kannst du Logik für die Bewegung der Kreatur implementieren
        // Beispiel: Bewegung basierend auf dem Genom
    }, [position, genome]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '10px',
                height: '10px',
                backgroundColor: '#00F', // Beispiel: Blaue Farbe für die Kreatur
            }}
        >
            {/* Hier könntest du zusätzliche Darstellungen oder Informationen zur Kreatur hinzufügen */}
        </div>
    );
};

export default Creature;
