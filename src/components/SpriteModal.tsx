import { genomeToHex } from '@/utils/genome'
import { convertBase } from '@/utils/math/convertBase'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'
import Modal from 'react-modal'
import React from 'react'
import { type SpriteState } from '@/utils/types/SpriteState'
import { NetworkVisualization } from '@/components/NetworkVisualization'

interface SpriteModalProps {
  selectedSprite: SpriteState | null
  setSelectedSprite: React.Dispatch<React.SetStateAction<SpriteState | null>>
}

const SpriteModal: React.FC<SpriteModalProps> = ({ setSelectedSprite, selectedSprite }) => {
  const closeModal = (): void => {
    setSelectedSprite(null)
  }

  return <Modal
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
                    <th>gene</th>
                    <th>source type</th>
                    <th>source id</th>
                    <th>sink type</th>
                    <th>sink id</th>
                    <th>weight</th>
                </tr>
                {selectedSprite.genome.map((gene, index) => (
                    <tr key={`${genomeToHex([gene])}-${index}`}>
                        <td>{genomeToHex([gene])}</td>
                        <td>{Number(convertBase.bin2dec(gene.sourceType)) === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal neuron' : 'sensory neuron'}</td>
                        <td>{convertBase.bin2dec(gene.sourceId)}</td>
                        <td>{Number(convertBase.bin2dec(gene.sinkType)) === SINK_TYPE_INTERNAL_NEURON ? 'internal neuron' : 'output action neuron'}</td>
                        <td>{convertBase.bin2dec(gene.sinkId)}</td>
                        <td>{convertBase.bin2dec(gene.weight)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h1>Neuronal Network Visualization</h1>
            <NetworkVisualization connections={selectedSprite.genome} />
        </>)}
    </Modal>
}

export default SpriteModal
