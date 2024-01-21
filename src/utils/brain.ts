import { type Genome } from '@/utils/types/Genome'
import {
  SINK_TYPE_INTERNAL_NEURON,
  SINK_TYPE_OUTPUT_ACTION_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_SENSORY_NEURON
} from '@/utils/consts/brain'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'
import { type DecimalGene } from '@/utils/types/DecimalGene'

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
  movingSpeed: number
}

export const brain = (sensoryInputs: SensoryInputs, genome: Genome): ActionOutputs => {
  const internalNeurons: Record<string, number> = {}
  const actionNeurons: Record<string, number> = {}
  const formattedDecimalGenomes = getFormattedDecimalGenome(genome)

  const calculateInternalNeurons = (): void => {
    formattedDecimalGenomes.filter((gen: DecimalGene) => {
      return gen.sinkType === SINK_TYPE_INTERNAL_NEURON
    }).forEach((gen: DecimalGene) => {
      const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
      const weightedValue = sourceValue * gen.weight

      internalNeurons[gen.sinkId] = (internalNeurons[gen.sinkId] || 0) + weightedValue
    })
  }

  const calculateActionNeurons = (): void => {
    formattedDecimalGenomes.filter((gen: DecimalGene) => {
      return gen.sinkType === SINK_TYPE_OUTPUT_ACTION_NEURON
    }).forEach((gen: DecimalGene) => {
      const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
      const weightedValue = sourceValue * gen.weight // Normalize weight to a smaller range

      actionNeurons[gen.sinkId] = (actionNeurons[gen.sinkId] || 0) + weightedValue
    })
  }

  const calculateResponse = (): ActionOutputs => {
    const directionX = Math.tanh(actionNeurons[0]) || 0
    const directionY = Math.tanh(actionNeurons[1]) || 0
    const random = Math.tanh(actionNeurons[2]) || 0
    const movingSpeed = Math.tanh(actionNeurons[3]) || 0

    return { directionX, directionY, random, movingSpeed }
  }

  const getSourceValue = (gen: DecimalGene, inputs: SensoryInputs, internals: Record<string, number>): number => {
    switch (gen.sourceType) {
      case SOURCE_TYPE_INPUT_SENSORY_NEURON: // Sensory input
        return getSensoryInputValue(gen.sourceId, inputs) || 0
      case SOURCE_TYPE_INPUT_INTERNAL_NEURON: // Internal neuron
        return internals[gen.sourceId] || 0
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
