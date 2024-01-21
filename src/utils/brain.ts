import { type Genome } from '@/utils/types/Genome'
import {
  SINK_TYPE_INTERNAL_NEURON,
  SINK_TYPE_OUTPUT_ACTION_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_SENSORY_NEURON
} from '@/utils/consts/brain'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'
import { type DecimalGene } from '@/utils/types/DecimalGene'
import { type SensoryInputs } from '@/utils/types/SensoryInputs'

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
    formattedDecimalGenomes
      .filter((gen: DecimalGene) => gen.sinkType === SINK_TYPE_INTERNAL_NEURON)
      .forEach((gen: DecimalGene) => {
        const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
        internalNeurons[gen.sinkId] = (internalNeurons[gen.sinkId] || 0) + sourceValue * gen.weight
      })
  }

  const calculateActionNeurons = (): void => {
    formattedDecimalGenomes
      .filter((gen: DecimalGene) => gen.sinkType === SINK_TYPE_OUTPUT_ACTION_NEURON)
      .forEach((gen: DecimalGene) => {
        const sourceValue = getSourceValue(gen, sensoryInputs, internalNeurons)
        actionNeurons[gen.sinkId] = (actionNeurons[gen.sinkId] || 0) + sourceValue * gen.weight
      })
  }

  const calculateResponse = (): ActionOutputs => ({
    directionX: Math.tanh(actionNeurons[0]) || 0,
    directionY: Math.tanh(actionNeurons[1]) || 0,
    random: Math.tanh(actionNeurons[2]) || 0,
    movingSpeed: Math.tanh(actionNeurons[3]) || 0
  })

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
