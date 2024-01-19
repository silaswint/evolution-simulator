import React from 'react'
import { type Genome } from '@/utils/types/Genome'
import CytoscapeComponent from 'react-cytoscapejs'
import { type LayoutOptions } from 'cytoscape'
import { SINK_TYPE_INTERNAL_NEURON, SOURCE_TYPE_INPUT_INTERNAL_NEURON } from '@/utils/consts/brain'
import { convertBase } from '@/utils/convertBase'

interface NetworkProps {
  connections: Genome
}

const options: LayoutOptions = {
  name: 'breadthfirst',
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // padding used on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) { return true }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) { return position } // transform a given node position. Useful for changing flow direction in discrete layouts
}

export const NetworkVisualization: React.FC<NetworkProps> = ({ connections }) => {
  const nodesMap = new Map<string, { data: { id: string, label: string } }>()
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
