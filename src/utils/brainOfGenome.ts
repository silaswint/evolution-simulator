import { evolutionConfig } from '@/utils/evolutionConfig'
import { type Genome } from '@/utils/types/Genome'
import { convertBase } from '@/utils/convertBase'
import {
  SINK_TYPE_INTERNAL_NEURON,
  SINK_TYPE_OUTPUT_ACTION_NEURON,
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
  moveX: number
  moveY: number
}

const generatedInnerNeurons = (): number[] => {
  const innerNeurons = []

  for (let i = 0; i < evolutionConfig.innerNeurons; i++) {
    innerNeurons.push(1)
  }

  return innerNeurons
}

type Neurons = Record<number, Record<number, number[]>>

type NeuronsCalculated = Record<number, Record<number, number>>

export const brainOfGenome = (sensoryInputs: SensoryInputs, genome: Genome): ActionOutputs => {
  const sensoryInputsKeys: Array<keyof SensoryInputs> = Object.keys(sensoryInputs) as Array<keyof SensoryInputs>

  const innerNeurons = generatedInnerNeurons()

  let neurons: Neurons = {}

  // first loop for input sensory neurons
  for (const gen of genome) {
    const sourceType = Number(convertBase.hex2dec(gen.sourceType))
    const sourceId = Number(convertBase.hex2dec(gen.sourceId))
    const sinkType = Number(convertBase.hex2dec(gen.sinkType))
    const sinkId = Number(convertBase.hex2dec(gen.sinkId))
    const weight = Number(gen.weight)

    if (Number(sourceType) === SOURCE_TYPE_INPUT_SENSORY_NEURON) {
      neurons = Object.assign({}, neurons, {
        [sinkType]: {
          [sinkId]: [
            weight * Number(sensoryInputsKeys[sourceId])
          ]
        }
      })
    }
  }

  // second loop for internal neurons
  for (const gen of genome) {
    const sourceType = Number(convertBase.hex2dec(gen.sourceType))
    const sourceId = Number(convertBase.hex2dec(gen.sourceId))
    const sinkType = Number(convertBase.hex2dec(gen.sinkType))
    const sinkId = Number(convertBase.hex2dec(gen.sinkId))
    const weight = Number(gen.weight)

    if (Number(sourceType) === SOURCE_TYPE_INPUT_INTERNAL_NEURON) {
      neurons = Object.assign({}, neurons, {
        [sinkType]: {
          [sinkId]: [
            weight * Number(innerNeurons[sourceId])
          ]
        }
      })
    }
  }

  // third loop for giving all internal neurons the correct value
  let neuronsCalculated: NeuronsCalculated = {}
  for (const sinkType in neurons) {
    if (Number(sinkType) === SINK_TYPE_INTERNAL_NEURON) {
      for (const sinkId in neurons[sinkType]) {
        neuronsCalculated = Object.assign({}, neuronsCalculated, {
          [sinkType]: {
            [sinkId]: Math.tanh(neurons[sinkType][sinkId].reduce((accumulator, currentValue) => accumulator + currentValue, 0))
          }
        })
      }
    }
  }

  // fourth loop for giving all action output neurons the correct value
  for (const sinkType in neurons) {
    if (Number(sinkType) === SINK_TYPE_OUTPUT_ACTION_NEURON) {
      for (const sinkId in neurons[sinkType]) {
        neuronsCalculated = Object.assign({}, neuronsCalculated, {
          [sinkType]: {
            [sinkId]: Math.tanh(neurons[sinkType][sinkId].reduce((accumulator, currentValue) => accumulator + currentValue, 0))
          }
        })
      }
    }
  }

  return {
    moveX: Math.tanh(neuronsCalculated[SINK_TYPE_OUTPUT_ACTION_NEURON]?.[0]) ?? 0,
    moveY: Math.tanh(neuronsCalculated[SINK_TYPE_OUTPUT_ACTION_NEURON]?.[1]) ?? 0
  }
}
