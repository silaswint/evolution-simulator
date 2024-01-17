// src/components/Creature.tsx
import React, { useState, useEffect } from 'react';
import { generateRandomGenome } from '@/utils/genomeUtils';
import { evolutionConfig } from '@/utils/evolutionConfig';

interface CreatureProps {
    initialPosition: { x: number; y: number };
    secondsLeftForCurrentGeneration: number;
}

const Creature: React.FC<CreatureProps> = ({ initialPosition, secondsLeftForCurrentGeneration }) => {
    const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition);
    const [genome, setGenome] = useState<string>(generateRandomGenome(evolutionConfig.genomeSize));

    useEffect(() => {
        const moveCreature = () => {
            if (secondsLeftForCurrentGeneration > 0) {
                const movementDirection = genome.substr(0, 1); // Annahme: Das erste Gen bestimmt die Bewegungsrichtung

                switch (movementDirection) {
                    case '0':
                        setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x - 1 }));
                        break;
                    case '1':
                        setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x + 1 }));
                        break;
                    case '2':
                        setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y - 1 }));
                        break;
                    case '3':
                        setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y + 1 }));
                        break;
                    default:
                    // Keine Bewegung
                }
            }
        };

        const moveInterval = setInterval(moveCreature, 1); // Annahme: Bewegung alle 1 Millisekunde

        // Cleanup-Funktion für die Aufhebung des Intervalls beim Entfernen der Komponente
        return () => clearInterval(moveInterval);
    }, [genome, secondsLeftForCurrentGeneration]);

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
