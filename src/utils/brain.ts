import { type Genome } from '@/utils/types/Genome'
import { type Gene } from '@/utils/types/Gene'
import {
  SINK_TYPE_INTERNAL_NEURON,
  SINK_TYPE_OUTPUT_ACTION_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_SENSORY_NEURON,
  WEIGHT_FLOATING_POINT
} from '@/utils/consts/brain'

interface SensoryInputs {
  age: number
  random: number
  currentPositionY: number
  currentPositionX: number
  generation: number
  sizeOfMapX: number
  sizeOfMapY: number
  population: number
}

interface ActionOutputs {
  directionX: number
  directionY: number
  random: number
}

export const brain = (sensoryInputs: SensoryInputs, genome: Genome): ActionOutputs => {
  const internalNeurons: Record<string, number> = {}
  const actionNeurons: Record<string, number> = {}

  const calculateInternalNeurons = (): void => {
    genome.filter((gen: Gene) => {
      return gen.sinkType === SINK_TYPE_INTERNAL_NEURON.toString()
    }).forEach((gen: Gene) => {
      const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
      const weightedValue = sourceValue * (parseFloat(gen.weight) / WEIGHT_FLOATING_POINT) // Normalize weight to a smaller range

      internalNeurons[gen.sinkId] = (internalNeurons[gen.sinkId] || 0) + weightedValue
    })
  }

  const calculateActionNeurons = (): void => {
    genome.filter((gen: Gene) => {
      return gen.sinkType === SINK_TYPE_OUTPUT_ACTION_NEURON.toString()
    }).forEach((gen: Gene) => {
      const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
      const weightedValue = sourceValue * (parseFloat(gen.weight) / WEIGHT_FLOATING_POINT) // Normalize weight to a smaller range

      actionNeurons[gen.sinkId] = (actionNeurons[gen.sinkId] || 0) + weightedValue
    })
  }

  const calculateResponse = (): ActionOutputs => {
    const directionX = Math.tanh(actionNeurons[0]) || 0
    const directionY = Math.tanh(actionNeurons[1]) || 0
    const random = Math.tanh(actionNeurons[2]) || 0

    return { directionX, directionY, random }
  }

  const getSourceValue = (gen: Gene, inputs: SensoryInputs, internals: Record<string, number>): number => {
    switch (gen.sourceType) {
      case SOURCE_TYPE_INPUT_SENSORY_NEURON.toString(): // Sensory input
        return getSensoryInputValue(gen.sourceId, inputs) || 0
      case SOURCE_TYPE_INPUT_INTERNAL_NEURON.toString(): // Internal neuron
        return internals[gen.sourceId] || 0
      default:
        return 0
    }
  }

  const getSensoryInputValue = (sourceId: string, inputs: SensoryInputs): number => {
    switch (sourceId) {
      case '0':
        return inputs.age
      case '1':
        return inputs.random
      case '2':
        return inputs.currentPositionY
      case '3':
        return inputs.currentPositionX
      case '4':
        return inputs.generation
      case '5':
        return inputs.sizeOfMapX
      case '6':
        return inputs.sizeOfMapY
      case '7':
        return inputs.population
      default:
        return 0
    }
  }

  calculateInternalNeurons()
  calculateActionNeurons()
  return calculateResponse()
}