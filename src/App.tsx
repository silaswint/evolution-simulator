import { Stage } from '@pixi/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { config } from '@/utils/config/config'
import { Hamsters } from '@/components/Hamsters'
import { type HamsterState } from '@/utils/types/HamsterState'
import HamsterModal from './components/HamsterModal'
import { generateRandomHamsters } from '@/utils/hamsters/generateRandomHamsters'
import 'bootstrap'
import '../scss/main.scss'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCakeCandles, faClock, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { type MapSize } from '@/utils/types/MapSize'
import { WindowContext } from '@/components/WindowContextProvider'
import { percentage } from '@/utils/math/percent'
import {
  CHALLENGE_INNER_CIRCLE_SURVIVES,
  CHALLENGE_NONE,
  CHALLENGE_RIGHT_SIDE_20_SURVIVES,
  CHALLENGE_RIGHT_SIDE_SURVIVES
} from '@/utils/consts/challenges'
import DownloadGenerationButton from '@/components/DownloadGenerationButton'
import { CameraContainer } from '@/components/CameraContainer'
import { getBestHamster } from '@/utils/hamsters/getBestHamster'
import Background from '@/components/Background'
import PauseOrContinue from '@/components/PauseOrContinue'

const App: React.FC = () => {
  const [generation, setGeneration] = useState<number>(0)
  const [population] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [selectedHamster, setSelectedHamster] = useState<HamsterState | null>(null)
  const [pause, setPause] = useState<boolean>(true)
  const [survivingPopulation, setSurvivingPopulation] = useState<number>(config.population)
  const [challenge, setChallenge] = useState<number>(config.challenge)
  const { clientHeight, clientWidth } = useContext(WindowContext)
  const [mapSizeIsLoaded, setMapSizeIsLoaded] = useState<boolean>(false)
  const [mapSize, setMapSize] = useState<MapSize>({
    width: clientWidth,
    height: clientHeight
  })
  const populationRef = useRef(population)
  const [hamsters, setHamsters] = useState<HamsterState[]>([])
  const [isCameraActive, setCameraActive] = useState<boolean>(false)

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapSizeIsLoaded) {
      setHamsters(generateRandomHamsters(populationRef, mapSize))
    }
  }, [mapSizeIsLoaded])

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect()
      setMapSize({
        width: rect.width,
        height: rect.height
      })
      setMapSizeIsLoaded(true)
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
    if (pause) {
      // Reset timer and return if paused
      return
    }

    const timerInterval = setInterval(() => {
      setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
    }, 1000)

    // Cleanup function to cancel the interval when removing the component or when paused
    return () => {
      clearInterval(timerInterval)
    }
  }, [pause, secondsPerGeneration])

  const resetGenerationCountdown = (): void => {
    setSecondsLeftForCurrentGeneration(config.secondsPerGeneration)
  }

  const handleChallengeChange: React.ChangeEventHandler<HTMLInputElement> = (event): void => {
    setChallenge(Number(event.target.value))
  }

  const bestHamster = getBestHamster(hamsters)

  return (
      <Container fluid className="mt-4" style={{ maxWidth: '800px' }}>
          <h1 className="mb-4">Evolution Simulation</h1>
          <Row className="mb-0">
              <Col xs={8} md={6}>
                  <Row className="mb-3">
                      <Col xs={5} md={4}>
                          <p className="mb-0" title={'Surviving population'}>
                              <PauseOrContinue setPause={setPause} pause={pause} />
                          </p>
                      </Col>
                      <Col xs={3} md={2} className="mb-2 mb-md-0">
                          <p className="mb-0" title={'Generation'}>
                              <FontAwesomeIcon icon={faCakeCandles} /> {generation}
                          </p>
                      </Col>
                      <Col xs={3} md={2} className="mb-2 mb-md-0">
                          <p className="mb-0" title={'Seconds left for current generation'}>
                              <FontAwesomeIcon icon={faClock} /> {secondsLeftForCurrentGeneration}
                          </p>
                      </Col>
                      <Col xs={5} md={4}>
                          <p className="mb-0" title={'Surviving population'}>
                              <FontAwesomeIcon icon={faPeopleGroup} /> { percentage(survivingPopulation, config.population)}%
                          </p>
                      </Col>
                  </Row>
              </Col>
              <Col xs={4} md={6} className="text-end">
                  <DownloadGenerationButton hamsters={hamsters} />
              </Col>
          </Row>
          <Row className="mb-3">
              <Col xs={6} md={6}>
                  <Form>
                      <Form.Group controlId="challengeSelect">
                          <Form.Label className="me-3">Challenge:</Form.Label>
                          <Form.Control as="select" value={challenge} onChange={handleChallengeChange}>
                              {[
                                { value: CHALLENGE_NONE, label: 'None' },
                                { value: CHALLENGE_RIGHT_SIDE_SURVIVES, label: 'Right side survives' },
                                { value: CHALLENGE_RIGHT_SIDE_20_SURVIVES, label: '20% of right side survives' },
                                { value: CHALLENGE_INNER_CIRCLE_SURVIVES, label: 'Inner circle survives (EXPERIMENTAL)' }
                              ].map(option => (
                                  <option key={option.value} value={option.value}>
                                      {option.label}
                                  </option>
                              ))}
                          </Form.Control>
                      </Form.Group>
                  </Form>
              </Col>
              <Col xs={6} md={6}>
                  <Form.Check
                      type="checkbox"
                      label="Activate Camera"
                      checked={isCameraActive}
                      onChange={() => { setCameraActive(!isCameraActive) }}
                  />
              </Col>
          </Row>
          <div
              ref={divRef}
              style={{
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                width: '100%',
                height: 'auto',
                maxHeight: `${config.mapSize.height}px`,
                maxWidth: `${config.mapSize.width}px`
              }}
          >
              <Stage width={mapSize.width} height={mapSize.height} options={{ backgroundAlpha: 0, antialias: true }}>
                  <Background challenge={challenge}>
                      <CameraContainer hamster={bestHamster} active={isCameraActive}>
                          {hamsters.length > 0 && (
                              <Hamsters
                                  population={population}
                                  secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration}
                                  generation={generation}
                                  setSelectedHamster={setSelectedHamster}
                                  resetGenerationCountdown={resetGenerationCountdown}
                                  setGeneration={setGeneration}
                                  setSurvivingPopulation={setSurvivingPopulation}
                                  hamsters={hamsters}
                                  setHamsters={setHamsters}
                                  mapSize={mapSize}
                                  pause={pause}
                                  survivingPopulation={survivingPopulation}
                                  challenge={challenge}
                                  setPause={setPause}
                                  bestHamster={bestHamster}
                              />
                          )}
                     </CameraContainer>
                  </Background>
              </Stage>
              <HamsterModal selectedHamster={selectedHamster} setSelectedHamster={setSelectedHamster} />
          </div>
      </Container>
  )
}

export default App
