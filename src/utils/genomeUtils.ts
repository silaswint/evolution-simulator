// src/utils/genomeUtils.ts
import { convertBase } from '@/utils/convertBase'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { type Genome } from '@/utils/types/Genome'
import { type Gen } from '@/utils/types/Gen'
import {
  NUM_ACTION_OUTPUT_NEURONS,
  NUM_SENSORY_NEURONS,
  SINK_TYPE_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  WEIGHT_FLOATING_POINT
} from '@/utils/consts/brain'

export const generateRandomGenome = (): Genome => {
  const randomBinary = (): number => Math.floor(Math.random() * 2)

  const genes: Genome = []
  for (let i = 0; i < evolutionConfig.genomeSize; i++) {
    genes.push({
      sourceType: randomBinary().toString(),
      sourceId: Array.from({ length: 7 }, randomBinary).join(''),
      sinkType: randomBinary().toString(),
      sinkId: Array.from({ length: 7 }, randomBinary).join(''),
      weight: Array.from({ length: 16 }, randomBinary).join('')
    })
  }

  return generateGenome(genes)
}

export const generateGenome = (genome: Genome): Genome => {
  const smallerFloatingPointWeight = (weight: string): string => {
    const decimalWeight = Number(convertBase.bin2dec(weight))
    return convertBase.dec2bin((decimalWeight / WEIGHT_FLOATING_POINT).toString())
  }

  return genome.map((gen: Gen) => {
    // 1-Bit: Quelle (0 für sensorisches Eingangsneuron, 1 für internes Neuron)
    const sourceType = gen.sourceType

    // 7-Bit: Index des Eingangsneurons oder internen Neurons
    const sourceId = Number(convertBase.bin2dec(sourceType)) === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? convertBase.dec2bin((Number(convertBase.bin2dec(gen.sourceId)) % evolutionConfig.innerNeurons).toString()) : convertBase.dec2bin((Number(convertBase.bin2dec(gen.sourceId)) % NUM_SENSORY_NEURONS).toString())

    // 1-Bit: Senke (0 für internes Neuron, 1 für Ausgangsaktionsneuron)
    const sinkType = gen.sinkType

    // 7-Bit: Index des internen Neurons oder Ausgangsaktionsneurons
    const sinkId = Number(convertBase.bin2dec(sourceType)) === SINK_TYPE_INTERNAL_NEURON ? convertBase.dec2bin((Number(convertBase.bin2dec(gen.sinkId)) % evolutionConfig.innerNeurons).toString()) : convertBase.dec2bin((Number(convertBase.bin2dec(gen.sinkId)) % NUM_ACTION_OUTPUT_NEURONS).toString())

    // 16-Bit: Gewicht der Verbindung
    const weight = smallerFloatingPointWeight(gen.weight)

    // Hexadezimale Darstellung mit auf 8 Zeichen begrenzter Länge
    return {
      sourceType,
      sourceId,
      sinkType,
      sinkId,
      weight
    }
  })
}

export const genomeToHex = (genome: Genome): string => {
  return genome.map((gen: Gen) => {
    const binaryGene = `${gen.sourceType}${gen.sourceId}${gen.sinkType}${gen.sinkId}${gen.weight}`

    // Hexadezimale Darstellung mit auf 8 Zeichen begrenzter Länge
    return convertBase.bin2hex(binaryGene)
  }).join(' ')
}

export const mutateGenome = (genome: string, mutationRate: number): string => {
  const mutateBit = (bit: string): string => (Math.random() < mutationRate ? randomHex() : bit)

  const randomHex = (): string => Math.floor(Math.random() * 16).toString(16)

  return genome
    .split('')
    .map(mutateBit)
    .join('')
}
