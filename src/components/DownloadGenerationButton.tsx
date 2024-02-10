import { genomeToHex } from '@/utils/genome'
import React from 'react'
import { Button } from 'react-bootstrap'
import fileDownload from 'js-file-download'
import { type HamsterState } from '@/utils/types/HamsterState'
import { config } from '@/utils/config/config'

const DownloadGenerationButton: React.FC<{ hamsters: HamsterState[] }> = ({ hamsters }) => {
  const downloadGeneration = (): void => {
    const hexHamsters = hamsters.map(hamster => genomeToHex(hamster.genome))
    const data = {
      config: {
        genomeSize: config.genomeSize,
        innerNeurons: config.innerNeurons
      },
      hamsters: hexHamsters
    }
    const asJson = JSON.stringify(data)

    fileDownload(asJson, 'generation.json')
  }

  return <Button variant="primary" onClick={downloadGeneration} title={'Download current generation of hamsters'}>Download</Button>
}

export default DownloadGenerationButton
