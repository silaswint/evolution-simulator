import {
  PRUNE_WEIGHT,
  SINK_TYPE_INTERNAL_NEURON,
  SINK_TYPE_OUTPUT_ACTION_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_SENSORY_NEURON
} from '@/utils/consts/brain'
import { type DecimalGene } from '@/utils/types/DecimalGene'
import { type SensoryInputs } from '@/utils/types/SensoryInputs'
import { Map } from 'immutable'
import { type DecimalGenome } from '@/utils/types/DecimalGenome'

interface ActionOutputs {
  directionX: number
  directionY: number
  random: number
  movingSpeed: number
}

export const brain = (sensoryInputs: SensoryInputs, formattedDecimalGenome: DecimalGenome): ActionOutputs => {
  const internalNeurons: Map<number, Map<number, number>> = Map()
  const actionNeurons: Record<string, number> = {}

  const calculateInternalNeurons = (): void => {
    formattedDecimalGenome
      .filter((gen: DecimalGene) => gen.sinkType === SINK_TYPE_INTERNAL_NEURON && Math.abs(gen.weight) > PRUNE_WEIGHT)
      .forEach((gen: DecimalGene) => {
        const sourceValue = getSourceValue(gen, sensoryInputs)

        internalNeurons.updateIn([gen.sinkLayerId, gen.sinkId], 0, (value: unknown): number => (value as number) + sourceValue * gen.weight)
      })
  }

  const calculateActionNeurons = (): void => {
    formattedDecimalGenome
      .filter((gen: DecimalGene) => gen.sinkType === SINK_TYPE_OUTPUT_ACTION_NEURON && Math.abs(gen.weight) > PRUNE_WEIGHT)
      .forEach((gen: DecimalGene) => {
        const sourceValue = getSourceValue(gen, sensoryInputs)
        actionNeurons[gen.sinkId] = (actionNeurons[gen.sinkId] || 0) + sourceValue * gen.weight
      })
  }

  const calculateResponse = (): ActionOutputs => ({
    directionX: Math.tanh(actionNeurons[0]) || 0,
    directionY: Math.tanh(actionNeurons[1]) || 0,
    random: Math.tanh(actionNeurons[2]) || 0,
    movingSpeed: Math.tanh(actionNeurons[3]) || 0
  })

  const getSourceValue = (gen: DecimalGene, inputs: SensoryInputs): number => {
    switch (gen.sourceType) {
      case SOURCE_TYPE_INPUT_SENSORY_NEURON:
        return getSensoryInputValue(gen.sourceId, inputs) || 0
      case SOURCE_TYPE_INPUT_INTERNAL_NEURON:
        // same as internalNeurons[gen.sourceLayerId][gen.sourceId] || 0
        return internalNeurons.getIn([gen.sourceLayerId, gen.sourceId], 0) as number
      default:
        return 0
    }
  }

  const getSensoryInputValue = (sourceId: number, inputs: SensoryInputs): number => {
    switch (sourceId) {
      case 0:
        return inputs.age
      case 1:
        return inputs.random
      case 2:
        return inputs.currentPositionY
      case 3:
        return inputs.currentPositionX
      case 4:
        return inputs.generation
      case 5:
        return inputs.sizeOfMapX
      case 6:
        return inputs.sizeOfMapY
      case 7:
        return inputs.population
      default:
        return 0
    }
  }

  calculateInternalNeurons()
  calculateActionNeurons()
  return calculateResponse()
}
