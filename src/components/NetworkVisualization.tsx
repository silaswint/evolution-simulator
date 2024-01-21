import React from 'react'
import { type Genome } from '@/utils/types/Genome'
import CytoscapeComponent from 'react-cytoscapejs'
import { type PresetLayoutOptions } from 'cytoscape'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'

interface NetworkProps {
  connections: Genome
}

const nodesMap = new Map<string, { data: { id: string, label: string } }>()
const options: PresetLayoutOptions = {
  name: 'preset',
  positions: (node) => {
    const position = { x: 0, y: 0 }

    // Adjust the y-coordinate based on node type
    // @ts-expect-error actually "_private" exists
    const nodeId: string = node._private.data.id
    if (nodeId.startsWith('sensory')) {
      // Top row for sensory nodes
      position.y = calculateYForNodeType(nodeId, 'sensory')
      position.x = calculateXForNodeType(nodeId, 'sensory')
    } else if (nodeId.startsWith('internal')) {
      // Middle row for internal nodes
      position.y = calculateYForNodeType(nodeId, 'internal')
      position.x = calculateXForNodeType(nodeId, 'internal')
    } else if (nodeId.startsWith('action')) {
      // Bottom row for action nodes
      position.y = calculateYForNodeType(nodeId, 'action')
      position.x = calculateXForNodeType(nodeId, 'action')
    }

    return position
  },
  zoom: undefined, // the zoom level to set (prob want fit = false if set)
  pan: undefined, // the pan level to set (prob want fit = false if set)
  fit: true, // whether to fit to viewport
  padding: 30, // padding on fit
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) { return true }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) { return position } // transform a given node position. Useful for changing flow direction in discrete layouts
}

// Helper function to calculate x-coordinate based on node type and position in row
const calculateXForNodeType = (nodeId: string, nodeType: string): number => {
  const nodeNumber = Number(nodeId.split('_')[1]) // Extract the numeric part of nodeId
  const horizontalSpacing = 100 // Adjust this value based on the desired spacing between nodes in the same row

  // Implement logic to calculate x-coordinate based on node type and position in row
  switch (nodeType) {
    case 'sensory':
      return nodeNumber * horizontalSpacing // Nodes in the 'sensory' row are spaced horizontally
    case 'internal':
      return (nodeNumber * horizontalSpacing) + 50 // Nodes in the 'internal' row are spaced horizontally
    case 'action':
      return nodeNumber * horizontalSpacing + 25 // Nodes in the 'action' row are spaced horizontally
    default:
      return 0
  }
}

// Helper function to calculate y-coordinate based on node type and position in row
const calculateYForNodeType = (nodeId: string, nodeType: string): number => {
  const nodeNumber = Number(nodeId.split('_')[1]) // Extract the numeric part of nodeId

  const addedY = nodeNumber % 2 === 0 ? 0 : 20
  switch (nodeType) {
    case 'sensory':
      return 100 + addedY
    case 'internal':
      return 300 + addedY
    case 'action':
      return 500 + addedY
    default:
      return 0
  }
}

export const NetworkVisualization: React.FC<NetworkProps> = ({ connections }) => {
  const formattedGenome = getFormattedDecimalGenome(connections)
  formattedGenome.forEach(conn => {
    const inputExternalLabel = conn.sourceType === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal' : 'sensory'
    const inputInternalLabel = conn.sinkType === SINK_TYPE_INTERNAL_NEURON ? 'internal' : 'action'

    if (!nodesMap.has(`${inputExternalLabel}_${conn.sourceId}`)) {
      nodesMap.set(`${inputExternalLabel}_${conn.sourceId}`, { data: { id: `${inputExternalLabel}_${conn.sourceId}`, label: `${inputExternalLabel} ${conn.sourceId}` } })
    }

    if (!nodesMap.has(`${inputInternalLabel}_${conn.sinkId}`)) {
      nodesMap.set(`${inputInternalLabel}_${conn.sinkId}`, { data: { id: `${inputInternalLabel}_${conn.sinkId}`, label: `${inputInternalLabel} ${conn.sinkId}` } })
    }
  })

  const nodes = Array.from(nodesMap.values())

  const edges = formattedGenome.map(conn => {
    const inputExternalLabel = conn.sourceType === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal' : 'sensory'
    const inputInternalLabel = conn.sinkType === SINK_TYPE_INTERNAL_NEURON ? 'internal' : 'action'

    return {
      data: {
        source: `${inputExternalLabel}_${conn.sourceId}`,
        target: `${inputInternalLabel}_${conn.sinkId}`,
        weight: conn.weight
      }
    }
  })

  const elements = {
    nodes,
    edges
  }

  return <CytoscapeComponent zoom={0.5} zoomingEnabled={false} layout={options} elements={CytoscapeComponent.normalizeElements(elements)} style={ { width: '600px', height: '300px' } } />
}
