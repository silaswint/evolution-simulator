// src/components/Creature.tsx
import React, { useState, useEffect } from 'react';
import { generateRandomGenome, genomeToHex } from '@/utils/genomeUtils';
import { evolutionConfig } from "@/utils/evolutionConfig";
import { brainOfGenome } from "@/utils/brainOfGenome";
import { Genome } from "@/utils/types/Genome";
import Modal from 'react-modal';
import {convertBase} from "@/utils/convertBase";
import {SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON} from "@/utils/consts/brain";
import {randomIntFromInterval} from "@/utils/random";

interface CreatureProps {
    secondsLeftForCurrentGeneration: number;
    generation: number;
    setPosition: React.Dispatch<React.SetStateAction<{[key: number]: { x: number; y: number }}>>;
    position: {[key: number]: { x: number; y: number }};
    id: number;
}

const Creature: React.FC<CreatureProps> = ({ secondsLeftForCurrentGeneration, generation, position, setPosition, id }) => {
    if (!position[id]) {
        return;
    }

    const [genome, setGenome] = useState<Genome>(generateRandomGenome());

    // Zustand, um zu verfolgen, ob das Modal geöffnet oder geschlossen ist
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (secondsLeftForCurrentGeneration > 0) {
            const brain = brainOfGenome({
                age: evolutionConfig.secondsPerGeneration - secondsLeftForCurrentGeneration,
                random: randomIntFromInterval(-4, 4),
                currentPositionY: position[id].y,
                currentPositionX: position[id].x,
                generation: generation,
                sizeOfMapX: evolutionConfig.mapSize.width,
                sizeOfMapY: evolutionConfig.mapSize.height,
                population: evolutionConfig.population
            }, genome);

            const movementDirectionX = brain.moveX;
            const movementDirectionY = brain.moveY;

            // Kopiere die aktuelle Position, um die Änderungen zu überwachen
            let newPosition = { ...position };

            if (movementDirectionX <= 0.5) {
                newPosition[id].x = Math.max(0, newPosition[id].x - 1); // Linke Grenze
            } else if (movementDirectionX > 0.5) {
                newPosition[id].x = Math.min(evolutionConfig.mapSize.width - 10, newPosition[id].x + 1); // Rechte Grenze
            } else if (movementDirectionY <= 0.5) {
                newPosition[id].y = Math.max(0, newPosition[id].y - 1); // Obere Grenze
            } else if (movementDirectionY > 0.5) {
                newPosition[id].y = Math.min(evolutionConfig.mapSize.height - 10, newPosition[id].y + 1); // Untere Grenze
            }

            // Setze die neue Position nur, wenn sie innerhalb der Grenzen liegt
            setPosition(newPosition);
            console.log(newPosition);
        }
    }, [genome, secondsLeftForCurrentGeneration, position, evolutionConfig]);


    // Funktion zum Öffnen des Modals
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Funktion zum Schließen des Modals
    const closeModal = () => {
        setIsModalOpen(false);
    };

    console.log(position[id])
    return (
        <>
            {/* Kreatur-Div */}
            <div
                onClick={openModal} // Öffne das Modal, wenn auf die Kreatur geklickt wird
                style={{
                    position: 'absolute',
                    left: `${position[id].x}px`,
                    top: `${position[id].y}px`,
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
