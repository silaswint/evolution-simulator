import { Stage } from '@pixi/react'
import React, { useEffect, useState } from 'react'
import { config } from '@/utils/config'
import { Hamsters } from '@/components/Hamsters'
import { type HamsterState } from '@/utils/types/HamsterState'
import HamsterModal from './components/HamsterModal'
import fileDownload from 'js-file-download'
import { generateRandomHamsters } from '@/utils/generateRandomHamsters'
import { genomeToHex } from '@/utils/genome'
import 'bootstrap'
import 'bootstrap/scss/bootstrap.scss'
import './custom.scss'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCakeCandles, faClock, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'

const mapSize = config.mapSize
const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedHamster, setSelectedHamster] = useState<HamsterState | null>(null)
  const [survivingPopulation, setSurvivingPopulation] = useState<number>(config.population)
  const [hamsters, setHamsters] = useState<HamsterState[]>(generateRandomHamsters(population))

  useEffect(() => {
    setSecondsLeftForCurrentGeneration(secondsPerGeneration)

    // Start the timer to update the remaining seconds
    const timerInterval = setInterval(() => {
      setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
    }, 1000)

    // Cleanup function for canceling the interval when removing the component
    return () => {
      clearInterval(timerInterval)
    }
  }, [secondsPerGeneration, generation])

  const resetGenerationCountdown = (): void => {
    setSecondsLeftForCurrentGeneration(config.secondsPerGeneration)
  }

  const downloadGeneration = (): void => {
    fileDownload(JSON.stringify(hamsters.map(hamster => genomeToHex(hamster.genome))), 'generation.json')
  }

  return (
      <Container fluid className="mt-4" style={{ maxWidth: '800px' }}>
          <h1 className="mb-4">Evolution Simulation</h1>
          <Row className="mb-3">
              <Col>
                  <Row className="mb-3">
                      <Col xs={6} md={2} className="mb-2 mb-md-0">
                          <p className="mb-0" title={'Generation'}><FontAwesomeIcon icon={faCakeCandles} /> {generation}</p>
                      </Col>
                      <Col xs={6} md={2} className="mb-2 mb-md-0">
                          <p className="mb-0" title={'Seconds left for current generation'}><FontAwesomeIcon icon={faClock} /> {secondsLeftForCurrentGeneration}</p>
                      </Col>
                      <Col xs={12} md={4}>
                          <p className="mb-0" title={'Surviving population'}><FontAwesomeIcon icon={faPeopleGroup} /> {survivingPopulation}/{config.population}</p>
                      </Col>
                  </Row>
              </Col>
              <Col className="text-end">
                  <Button variant="primary" onClick={downloadGeneration} title={'Download current generation of hamsters'}>Download</Button>
              </Col>
          </Row>
          <Stage width={mapSize.width} height={mapSize.height} options={{ backgroundColor: 0xeef1f5 }}>
              <Hamsters population={population} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} setSelectedHamster={setSelectedHamster} resetGenerationCountdown={resetGenerationCountdown} setGeneration={setGeneration} setSurvivingPopulation={setSurvivingPopulation} hamsters={hamsters} setHamsters={setHamsters}/>
          </Stage>
          <HamsterModal selectedHamster={selectedHamster} setSelectedHamster={setSelectedHamster} />
      </Container>
  )
}

export default App
