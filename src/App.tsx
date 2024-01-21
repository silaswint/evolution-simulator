import { Stage } from '@pixi/react'
import React, { type ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { config } from '@/utils/config'
import { Hamsters } from '@/components/Hamsters'
import { type HamsterState } from '@/utils/types/HamsterState'
import HamsterModal from './components/HamsterModal'
import fileDownload from 'js-file-download'
import { generateRandomHamsters } from '@/utils/generateRandomHamsters'
import { genomeToHex } from '@/utils/genome'
import 'bootstrap'
import '../scss/main.scss'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCakeCandles, faClock, faPause, faPeopleGroup, faPlay } from '@fortawesome/free-solid-svg-icons'
import { type MapSize } from '@/utils/types/MapSIze'
import { WindowContext } from '@/components/WindowContextProvider'

const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedHamster, setSelectedHamster] = useState<HamsterState | null>(null)
  const [pause, setPause] = useState<boolean>(true)
  const [survivingPopulation, setSurvivingPopulation] = useState<number>(config.population)
  const { clientHeight, clientWidth } = useContext(WindowContext)
  const [mapSize, setMapSize] = useState<MapSize>({
    width: clientWidth,
    height: clientHeight
  })
  const populationRef = useRef(population)
  const mapSizeRef = useRef(mapSize)
  const [hamsters, setHamsters] = useState<HamsterState[]>(generateRandomHamsters(populationRef, mapSizeRef))

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect()
      setMapSize({
        width: rect.width,
        height: rect.height
      })
    }
  }, [])
  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect()
      setMapSize({
        width: rect.width,
        height: rect.height
      })
    }
  }, [clientWidth, clientHeight])

  useEffect(() => {
    setSecondsLeftForCurrentGeneration(secondsPerGeneration)

    // Only start the timer if "pause" is not true
    if (!pause) {
      const timerInterval = setInterval(() => {
        setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
      }, 1000)

      // Cleanup function to cancel the interval when removing the component
      return () => {
        clearInterval(timerInterval)
      }
    }

    // No timer when paused
    return undefined
  }, [secondsPerGeneration, generation, pause])

  const resetGenerationCountdown = (): void => {
    setSecondsLeftForCurrentGeneration(config.secondsPerGeneration)
  }

  const downloadGeneration = (): void => {
    fileDownload(JSON.stringify(hamsters.map(hamster => genomeToHex(hamster.genome))), 'generation.json')
  }

  const onClickPause = (): void => {
    setPause(true)
  }

  const onClickPlay = (): void => {
    setPause(false)
  }

  const PauseOrContinue = (): ReactNode => {
    return !pause
      ? <Button onClick={ onClickPause } variant="secondary" size="sm">
            <FontAwesomeIcon icon={faPause} />
        </Button>
      : <Button onClick={ onClickPlay } variant="secondary" size="sm">
            <FontAwesomeIcon icon={faPlay} />
        </Button>
  }

  return (
      <Container fluid className="mt-4" style={{ maxWidth: '800px' }}>
          <h1 className="mb-4">Evolution Simulation</h1>
          <Row className="mb-3">
              <Col xs={8} md={6}>
                  <Row className="mb-3">
                      <Col xs={5} md={4}>
                          <p className="mb-0" title={'Surviving population'}><PauseOrContinue /></p>
                      </Col>
                      <Col xs={3} md={2} className="mb-2 mb-md-0">
                          <p className="mb-0" title={'Generation'}><FontAwesomeIcon icon={faCakeCandles} /> {generation}</p>
                      </Col>
                      <Col xs={3} md={2} className="mb-2 mb-md-0">
                          <p className="mb-0" title={'Seconds left for current generation'}><FontAwesomeIcon icon={faClock} /> {secondsLeftForCurrentGeneration}</p>
                      </Col>
                      <Col xs={5} md={4}>
                          <p className="mb-0" title={'Surviving population'}><FontAwesomeIcon icon={faPeopleGroup} /> {survivingPopulation}/{config.population}</p>
                      </Col>
                  </Row>
              </Col>
              <Col xs={4} md={6} className="text-end">
                  <Button variant="primary" onClick={downloadGeneration} title={'Download current generation of hamsters'}>Download</Button>
              </Col>
          </Row>
          <div ref={divRef} style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', width: '100%', height: 'auto', maxHeight: `${config.mapSize.height}px`, maxWidth: `${config.mapSize.width}px` }}>
              <Stage width={mapSize.width} height={mapSize.height} options={{ backgroundColor: 0x343a40 }}>
                  <Hamsters population={population} secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration} generation={generation} setSelectedHamster={setSelectedHamster} resetGenerationCountdown={resetGenerationCountdown} setGeneration={setGeneration} setSurvivingPopulation={setSurvivingPopulation} hamsters={hamsters} setHamsters={setHamsters} mapSize={mapSize} pause={pause} />
              </Stage>
              <HamsterModal selectedHamster={selectedHamster} setSelectedHamster={setSelectedHamster} />
          </div>
      </Container>
  )
}

export default App
