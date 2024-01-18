// src/components/Creature.tsx
import React, { useState, useEffect } from 'react';
import { generateRandomGenome, genomeToHex } from '@/utils/genomeUtils';
import { evolutionConfig } from "@/utils/evolutionConfig";
import { brainOfGenome } from "@/utils/brainOfGenome";
import { Genome } from "@/utils/types/Genome";
import Modal from 'react-modal';
import {convertBase} from "@/utils/convertBase";
import {SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON} from "@/utils/consts/brain";

interface CreatureProps {
    initialPosition: { x: number; y: number };
    secondsLeftForCurrentGeneration: number;
}

const Creature: React.FC<CreatureProps> = ({ initialPosition, secondsLeftForCurrentGeneration }) => {
    const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition);
    const [genome, setGenome] = useState<Genome>(generateRandomGenome());

    // Zustand, um zu verfolgen, ob das Modal geöffnet oder geschlossen ist
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const moveCreature = () => {
            if (secondsLeftForCurrentGeneration > 0) {
                const brain = brainOfGenome({
                    Slr: 0, // pheromone gradient left-right
                    Sfd: 0, // pheromone gradient forward
                    Sg: 0, // pheromone density
                    Age: 0, // age
                    Rnd: 0, // random input
                    Blr: 0, // blockage left-right
                    Osc: 0, // oscillator
                    Bfc: 0, // blockage forward
                    Plr: 0, // population gradient left-right
                    Pop: 0, // population density
                    Pfd: 0, // population gradient forward
                    LPf: 0, // population long-range forward
                    LMy: 0, // last movement Y
                    LBf: 0, // blockage long-range forward
                    LMx: 0, // last movement X
                    BDy: 0, // north/south border distance
                    Gen: 0, // genetic similarity of fwd neighbor
                    BDx: 0, // east/west border distance
                    Lx: 0, // east/west world location
                    BD: 0, // nearest border distance
                    Ly: 0, // north/south world location
                }, genome);

                const movementDirection = brain.MvL;

                // Kopiere die aktuelle Position, um die Änderungen zu überwachen
                let newPosition = { ...position };

                if (movementDirection < 0.25) {
                    newPosition.x = Math.max(0, newPosition.x - 1); // Linke Grenze
                } else if (movementDirection < 0.5) {
                    newPosition.x = Math.min(evolutionConfig.mapSize.width - 10, newPosition.x + 1); // Rechte Grenze
                } else if (movementDirection < 0.75) {
                    newPosition.y = Math.max(0, newPosition.y - 1); // Obere Grenze
                } else if (movementDirection <= 1) {
                    newPosition.y = Math.min(evolutionConfig.mapSize.height - 10, newPosition.y + 1); // Untere Grenze
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


    // Funktion zum Öffnen des Modals
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Funktion zum Schließen des Modals
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Kreatur-Div */}
            <div
                onClick={openModal} // Öffne das Modal, wenn auf die Kreatur geklickt wird
                style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#00F',
                }}
                data-genome={genomeToHex(genome)}
            >
                {/* Hier könntest du zusätzliche Darstellungen oder Informationen zur Kreatur hinzufügen */}
            </div>

            {/* React-Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Creature Details"
                style={{
                    content: {
                        width: '80%',
                        maxWidth: '400px',
                        height: '80%',
                        maxHeight: '600px',
                        margin: 'auto',
                        overflow: 'auto',
                    },
                }}
            >
                <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
                    X
                </button>
                {/* Hier könntest du den Inhalt deines Modals platzieren, z.B. Informationen zur Kreatur */}
                <h2>Creature</h2>
                <p>Genome: {genomeToHex(genome)}</p>

                <h3>Details</h3>
                <table>
                    <tbody>
                    <tr>
                        <th>gen</th>
                        <th>source type</th>
                        <th>source id</th>
                        <th>sink type</th>
                        <th>sink id</th>
                        <th>weight</th>
                    </tr>
                    {genome.map(gen => {
                        return <tr>
                            <td>{genomeToHex([gen])}</td>
                            <td>{Number(convertBase.bin2dec(gen.sourceType)) === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal neuron' : 'sensory neuron'}</td>
                            <td>{convertBase.bin2dec(gen.sourceId)}</td>
                            <td>{Number(convertBase.bin2dec(gen.sinkType)) === SINK_TYPE_INTERNAL_NEURON ? 'internal neuron' : 'output action neuron'}</td>
                            <td>{convertBase.bin2dec(gen.sinkId)}</td>
                            <td>{convertBase.bin2dec(gen.weight)}</td>
                        </tr>;
                    })}
                    </tbody>
                </table>
            </Modal>
        </>
    );
};

export default Creature;
