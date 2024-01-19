import { type Genome } from '@/utils/types/Genome'
import { type Gen } from '@/utils/types/Gen'
import {
  SINK_TYPE_INTERNAL_NEURON, SINK_TYPE_OUTPUT_ACTION_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_SENSORY_NEURON
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

export const brainOfGenome = (sensoryInputs: SensoryInputs, genome: Genome): ActionOutputs => {
  const internalNeurons: Record<string, number> = {}

  const calculateInternalNeurons = (): void => {
    genome.forEach((gen: Gen) => {
      const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
      const weightedValue = sourceValue * parseFloat(gen.weight) / 10000 // Normalize weight to a smaller range

      if (gen.sinkType === SINK_TYPE_INTERNAL_NEURON.toString() && gen.sinkId in internalNeurons) {
        internalNeurons[gen.sinkId] += weightedValue
      } else if (gen.sinkType === SINK_TYPE_OUTPUT_ACTION_NEURON.toString()) {
        internalNeurons[gen.sinkId] = weightedValue
      }
    })
  }

  const calculateActionOutputs = (): ActionOutputs => {
    const directionX = Math.tanh(internalNeurons.outputActionX || 0)
    const directionY = Math.tanh(internalNeurons.outputActionY || 0)
    const random = Math.tanh(internalNeurons.outputActionRandom || 0)

    return { directionX, directionY, random }
  }

  const getSourceValue = (gen: Gen, inputs: SensoryInputs, internals: Record<string, number>): number => {
    switch (gen.sourceType) {
      case SOURCE_TYPE_INPUT_SENSORY_NEURON.toString(): // Sensory input
        return getSensoryInputValue(gen.sourceId, inputs)
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
  return calculateActionOutputs()
}
