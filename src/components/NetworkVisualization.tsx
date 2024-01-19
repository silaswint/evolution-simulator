import React from 'react'
import { type Genome } from '@/utils/types/Genome'
import CytoscapeComponent from 'react-cytoscapejs'
import { type PresetLayoutOptions } from 'cytoscape'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'
import { convertBase } from '@/utils/convertBase'

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
      position.y = 100
    } else if (nodeId.startsWith('internal')) {
      // Middle row for internal nodes
      position.y = 300
    } else if (nodeId.startsWith('action')) {
      // Bottom row for action nodes
      position.y = 500
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

export const NetworkVisualization: React.FC<NetworkProps> = ({ connections }) => {
  connections.forEach(conn => {
    const inputExternalLabel = conn.sourceType === SOURCE_TYPE_INPUT_INTERNAL_NEURON.toString() ? 'internal' : 'sensory'
    const inputInternalLabel = conn.sinkType === SINK_TYPE_INTERNAL_NEURON.toString() ? 'internal' : 'action'

    if (!nodesMap.has(`${inputExternalLabel}_${conn.sourceId}`)) {
      nodesMap.set(`${inputExternalLabel}_${conn.sourceId}`, { data: { id: `${inputExternalLabel}_${conn.sourceId}`, label: `${inputExternalLabel} ${convertBase.bin2dec(conn.sourceId)}` } })
    }

    if (!nodesMap.has(`${inputInternalLabel}_${conn.sinkId}`)) {
      nodesMap.set(`${inputInternalLabel}_${conn.sinkId}`, { data: { id: `${inputInternalLabel}_${conn.sinkId}`, label: `${inputInternalLabel} ${convertBase.bin2dec(conn.sinkId)}` } })
    }
  })

  const nodes = Array.from(nodesMap.values())

  const edges = connections
    .map(conn => {
      const inputExternalLabel = conn.sourceType === SOURCE_TYPE_INPUT_INTERNAL_NEURON.toString() ? 'internal' : 'sensory'
      const inputInternalLabel = conn.sinkType === SINK_TYPE_INTERNAL_NEURON.toString() ? 'internal' : 'action'

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

  return <CytoscapeComponent layout={options} elements={CytoscapeComponent.normalizeElements(elements)} style={ { width: '600px', height: '600px' } } />
}
