import { genomeToHex } from '@/utils/genome'
import React from 'react'
import { Button } from 'react-bootstrap'
import fileDownload from 'js-file-download'
import { type HamsterState } from '@/utils/types/HamsterState'

const DownloadGenerationButton: React.FC<{ hamsters: HamsterState[] }> = ({ hamsters }) => {
  const downloadGeneration = (): void => {
    fileDownload(JSON.stringify(hamsters.map(hamster => genomeToHex(hamster.genome))), 'generation.json')
  }

  return <Button variant="primary" onClick={downloadGeneration} title={'Download current generation of hamsters'}>Download</Button>
}

export default DownloadGenerationButton
