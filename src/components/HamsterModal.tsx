import { genomeToHex } from '@/utils/genome'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'
import React from 'react'
import { NetworkVisualization } from '@/components/NetworkVisualization'
import { type HamsterModalProps } from '@/utils/types/HamsterModalProps'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'
import { type DecimalGene } from '@/utils/types/DecimalGene'
import { Button, Modal, Table } from 'react-bootstrap'
import ShowMoreText from 'react-show-more-text'

const HamsterModal: React.FC<HamsterModalProps> = ({ setSelectedHamster, selectedHamster }) => {
  const closeModal = (): void => {
    setSelectedHamster(null)
  }
  return <Modal show={(selectedHamster != null)} onHide={closeModal}>
    <Modal.Header closeButton>
      <Modal.Title>Hamster</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {(selectedHamster != null) && (<>
        <h3>Hamster details</h3>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>#{selectedHamster.id}</td>
            </tr>
            <tr>
              <td>Position</td>
              <td>{selectedHamster.x}x{selectedHamster.y}</td>
            </tr>
            <tr>
              <td>Genome</td>
              <td>
                <ShowMoreText
                    lines={1}
                    more="Show more"
                    less="(Show less)"
                    className="content-css"
                    anchorClass="show-more-less-clickable"
                    expanded={false}
                    width={280}
                    truncatedEndingComponent={'... '}
                >
                  {genomeToHex(selectedHamster.genome)}
                </ShowMoreText></td>
            </tr>
          </tbody>
        </Table>

        <h3>Neuronal Network Visualization</h3>
        <NetworkVisualization connections={selectedHamster.genome} />

        <h3>Genome detail view</h3>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>gene</th>
              <th>source type</th>
              <th>source id</th>
              <th>sink type</th>
              <th>sink id</th>
              <th>weight</th>
            </tr>
          </thead>
          <tbody>
          {getFormattedDecimalGenome(selectedHamster.genome).map((gene: DecimalGene, index) => (
              <tr key={`${gene.hex}-${index}`}>
                <td>{gene.hex}</td>
                <td>{gene.sourceType === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal neuron' : 'sensory neuron'}</td>
                <td>{gene.sourceId}</td>
                <td>{gene.sinkType === SINK_TYPE_INTERNAL_NEURON ? 'internal neuron' : 'output action neuron'}</td>
                <td>{gene.sinkId}</td>
                <td>{gene.weight}</td>
              </tr>
          ))}
          </tbody>
        </Table>
      </>)}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={closeModal}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
}

export default HamsterModal
