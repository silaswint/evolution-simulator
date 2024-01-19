import { Stage } from '@pixi/react'
import React, { useEffect, useState } from 'react'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { Map } from '@/components/Map'
import Modal from 'react-modal'
import { type SpriteState } from '@/utils/types/SpriteState'
import { genomeToHex } from '@/utils/genomeUtils'
import { convertBase } from '@/utils/convertBase'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'

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

  const closeModal = (): void => {
    setSelectedSprite(null)
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

              <Modal
                  isOpen={(selectedSprite != null)}
                  onRequestClose={closeModal}
                  contentLabel="Sprite Details"
                  ariaHideApp={false}
                  style={{
                    content: {
                      width: '80%',
                      maxWidth: '400px',
                      height: '80%',
                      maxHeight: '600px',
                      margin: 'auto',
                      overflow: 'auto'
                    }
                  }}
              >
                  {(selectedSprite != null) && (<>
                      <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
                          X
                      </button>
                      <h2>Sprite Details</h2>
                      <p>ID: {selectedSprite.id}</p>
                      <p>Genome: {genomeToHex(selectedSprite.genome)}</p>
                      <p>Position: {selectedSprite.x}x{selectedSprite.y}</p>

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
                          {selectedSprite.genome.map((gen, index) => (
                              <tr key={`${genomeToHex([gen])}-${index}`}>
                                  <td>{genomeToHex([gen])}</td>
                                  <td>{Number(convertBase.bin2dec(gen.sourceType)) === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal neuron' : 'sensory neuron'}</td>
                                  <td>{convertBase.bin2dec(gen.sourceId)}</td>
                                  <td>{Number(convertBase.bin2dec(gen.sinkType)) === SINK_TYPE_INTERNAL_NEURON ? 'internal neuron' : 'output action neuron'}</td>
                                  <td>{convertBase.bin2dec(gen.sinkId)}</td>
                                  <td>{convertBase.bin2dec(gen.weight)}</td>
                              </tr>
                          ))}
                          </tbody>
                      </table>
                  </>)}
              </Modal>
      </>
  )
}

export default App
