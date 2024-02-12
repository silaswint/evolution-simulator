import React from 'react'
import { type Genome } from '@/utils/types/Genome'
import CytoscapeComponent from 'react-cytoscapejs'
import { type PresetLayoutOptions } from 'cytoscape'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'
import { type DecimalGene } from '@/utils/types/DecimalGene'
import { config } from '@/utils/config/config'

interface NetworkProps {
  connections: Genome
}

const nodesMap = new Map<string, { data: { id: string, label: string } }>()
const options: PresetLayoutOptions = {
  name: 'preset',
  positions: (node) => {
    const position = { x: 0, y: 0 }

    // Adjust the coordinates based on node type
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
  const splitNode = nodeId.split('_')
  const layerNumber = Number(splitNode[1])
  const nodeNumber = Number(splitNode[2])

  const addedX = 100 // Adjust this value based on the desired spacing between nodes in the same row

  // Implement logic to calculate x-coordinate based on node type and position in row
  switch (nodeType) {
    case 'sensory':
      return nodeNumber * addedX // Nodes in the 'sensory' row are spaced horizontally
    case 'internal':
      return (nodeNumber * addedX) + 50 // Nodes in the 'internal' row are spaced horizontally
    case 'action':
      return nodeNumber * addedX + 25 // Nodes in the 'action' row are spaced horizontally
    default:
      return 0
  }
}

// Helper function to calculate y-coordinate based on node type and position in row
const calculateYForNodeType = (nodeId: string, nodeType: string): number => {
  const splitNode = nodeId.split('_')
  const layerNumber = Number(splitNode[1])
  const nodeNumber = Number(splitNode[2])

  const addedY = nodeNumber % 2 === 0 ? 0 : 20
  switch (nodeType) {
    case 'sensory':
      return 100 + addedY
    case 'internal':
      return 300 + addedY + (layerNumber * 200)
    case 'action':
      return 300 + addedY + (config.innerNeurons.length * 200)
    default:
      return 0
  }
}

const getInputExternalLabel = (sourceType: number): string => {
  return sourceType === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? 'internal' : 'sensory'
}

const getInputInternalLabel = (sinkType: number): string => {
  return sinkType === SINK_TYPE_INTERNAL_NEURON ? 'internal' : 'action'
}

const getNodeKeySource = (conn: DecimalGene): string => {
  const inputExternalLabel = getInputExternalLabel(conn.sourceType)
  return `${inputExternalLabel}_${conn.sourceLayerId}_${conn.sourceId}`
}

const getNodeKeySink = (conn: DecimalGene): string => {
  const inputInternalLabel = getInputInternalLabel(conn.sinkType)
  return `${inputInternalLabel}_${conn.sinkLayerId}_${conn.sinkId}`
}

export const NetworkVisualization: React.FC<NetworkProps> = ({ connections }) => {
  const formattedGenome = getFormattedDecimalGenome(connections)
  formattedGenome.forEach(conn => {
    const inputExternalLabel = getInputExternalLabel(conn.sourceType)
    const inputInternalLabel = getInputInternalLabel(conn.sinkType)

    const nodeKeySource = getNodeKeySource(conn)
    const nodeKeySink = getNodeKeySink(conn)

    if (!nodesMap.has(nodeKeySource)) {
      nodesMap.set(nodeKeySource, { data: { id: nodeKeySource, label: `${inputExternalLabel} #${conn.sourceId}` } })
    }

    if (!nodesMap.has(nodeKeySink)) {
      nodesMap.set(nodeKeySink, { data: { id: nodeKeySink, label: `${inputInternalLabel} #${conn.sinkId}` } })
    }
  })

  const nodes = Array.from(nodesMap.values())

  const edges = formattedGenome.map(conn => {
    return {
      data: {
        source: getNodeKeySource(conn),
        target: getNodeKeySink(conn),
        weight: conn.weight
      }
    }
  })

  const elements = {
    nodes,
    edges
  }

  const style = [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        textValign: 'center',
        color: 'white',
        backgroundColor: '#2d3849',
        shape: 'roundrectangle',
        textBackgroundOpacity: 1,
        textBackgroundColor: '#2d3849'
      }
    },
    {
      selector: 'edge',
      style: {
        width: 2,
        textOutlineColor: 'grey'
      }
    }
  ]

  const zoom = 0.7
  const calculatedHeight = 300 + 20 + (config.innerNeurons.length * 200) * zoom
  const calculatedHeightWithPx = `${calculatedHeight}px`
  return <CytoscapeComponent stylesheet={style} zoom={zoom} zoomingEnabled={false} layout={options} elements={CytoscapeComponent.normalizeElements(elements)} style={ { width: '600px', height: calculatedHeightWithPx } } />
}
