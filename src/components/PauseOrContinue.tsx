import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

interface PauseOrContinueProps {
  pause: boolean
  setPause: React.Dispatch<React.SetStateAction<boolean>>
}

const PauseOrContinue: React.FC<PauseOrContinueProps> = ({ setPause, pause }) => {
  const onClickPause = (): void => {
    setPause(true)
  }

  const onClickPlay = (): void => {
    setPause(false)
  }

  return !pause
    ? <Button onClick={ onClickPause } variant="secondary" size="sm">
            <FontAwesomeIcon icon={faPause} />
        </Button>
    : <Button onClick={ onClickPlay } variant="secondary" size="sm">
            <FontAwesomeIcon icon={faPlay} />
        </Button>
}

export default PauseOrContinue
