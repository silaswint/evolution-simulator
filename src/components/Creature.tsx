// src/components/Creature.tsx
import React, { useState, useEffect } from 'react';
import { generateRandomGenome } from '@/utils/genomeUtils';
import {evolutionConfig} from "@/utils/evolutionConfig";

interface CreatureProps {
    initialPosition: { x: number; y: number };
    secondsLeftForCurrentGeneration: number;
}

const Creature: React.FC<CreatureProps> = ({ initialPosition, secondsLeftForCurrentGeneration }) => {
    const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition);
    const [genome, setGenome] = useState<string>(generateRandomGenome());

    useEffect(() => {
        const moveCreature = () => {
            if (secondsLeftForCurrentGeneration > 0) {
                const movementDirection = genome.substr(0, 1);

                // Kopiere die aktuelle Position, um die Änderungen zu überwachen
                let newPosition = { ...position };

                switch (movementDirection) {
                    case '0':
                        newPosition.x = Math.max(0, newPosition.x - 1); // Linke Grenze
                        break;
                    case '1':
                        newPosition.x = Math.min(evolutionConfig.mapSize.width - 10, newPosition.x + 1); // Rechte Grenze
                        break;
                    case '2':
                        newPosition.y = Math.max(0, newPosition.y - 1); // Obere Grenze
                        break;
                    case '3':
                        newPosition.y = Math.min(evolutionConfig.mapSize.height - 10, newPosition.y + 1); // Untere Grenze
                        break;
                    default:
                    // Keine Bewegung
                }

                // Setze die neue Position nur, wenn sie innerhalb der Grenzen liegt
                if (
                    newPosition.x >= 0 &&
                    newPosition.x <= evolutionConfig.mapSize.width - 10 &&
                    newPosition.y >= 0 &&
                    newPosition.y <= evolutionConfig.mapSize.height - 10
                ) {
                    setPosition(newPosition);
                }
            }
        };

        const moveInterval = setInterval(moveCreature, 1);

        return () => clearInterval(moveInterval);
    }, [genome, secondsLeftForCurrentGeneration, position]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '10px',
                height: '10px',
                backgroundColor: '#00F',
            }}
            data-genome={genome}
        >
            {/* Hier könntest du zusätzliche Darstellungen oder Informationen zur Kreatur hinzufügen */}
        </div>
    );
};

export default Creature;
