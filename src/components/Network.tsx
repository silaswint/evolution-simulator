import React from 'react'
import { type Genome } from '@/utils/types/Genome'
import CytoscapeComponent from 'react-cytoscapejs'

interface NetworkProps {
  connections: Genome
}

export const Network: React.FC<NetworkProps> = ({ connections }) => {
  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
  ]

  return <CytoscapeComponent elements={elements} style={ { width: '600px', height: '600px' } } />
}
