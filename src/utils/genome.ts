// src/utils/genomeUtils.ts
import { convertBase } from '@/utils/math/convertBase'
import { config } from '@/utils/config'
import { type Genome } from '@/utils/types/Genome'
import { type Gene } from '@/utils/types/Gene'
import {
  NUM_ACTION_OUTPUT_NEURONS,
  NUM_SENSORY_NEURONS,
  SINK_TYPE_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON
} from '@/utils/consts/brain'

export const generateRandomGenome = (): Genome => {
  const randomBinary = (): number => Math.floor(Math.random() * 2)

  const genes: Genome = []
  for (let i = 0; i < config.genomeSize; i++) {
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
  return genome.map((gen: Gene) => {
    // 1-Bit: Source (0 for sensory input neuron, 1 for internal neuron)
    const sourceType = gen.sourceType

    // 7-Bit: Index of the input neuron or internal neuron
    const sourceId = Number(convertBase.bin2dec(sourceType)) === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? convertBase.dec2bin((Number(convertBase.bin2dec(gen.sourceId)) % config.innerNeurons).toString()) : convertBase.dec2bin((Number(convertBase.bin2dec(gen.sourceId)) % NUM_SENSORY_NEURONS).toString())

    // 1-Bit: Sink (0 for internal neuron, 1 for output action neuron)
    const sinkType = gen.sinkType

    // 7-Bit: Index of the internal neuron or output action neuron
    const sinkId = Number(convertBase.bin2dec(sourceType)) === SINK_TYPE_INTERNAL_NEURON ? convertBase.dec2bin((Number(convertBase.bin2dec(gen.sinkId)) % config.innerNeurons).toString()) : convertBase.dec2bin((Number(convertBase.bin2dec(gen.sinkId)) % NUM_ACTION_OUTPUT_NEURONS).toString())

    // 16-Bit: Weight of the connection
    const weight = gen.weight

    // Hexadecimal representation with a length limited to 8 characters
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
  return genome.map((gen: Gene) => {
    const binaryGene = `${gen.sourceType}${gen.sourceId}${gen.sinkType}${gen.sinkId}${gen.weight}`

    // Hexadecimal representation with a length limited to 8 characters
    return convertBase.bin2hex(binaryGene)
  }).join(' ')
}

export const hexToGenome = (hexGenome: string[]): Genome => {
  return hexGenome.map((hexGene: string) => {
    const binaryGene = convertBase.hex2bin(hexGene)
    return {
      sourceType: binaryGene[0],
      sourceId: binaryGene.substring(1, 9),
      sinkType: binaryGene[8],
      sinkId: binaryGene.substring(9, 16),
      weight: binaryGene.substring(16, 32)
    }
  })
}

export const mutateGenome = (genome: Genome): Genome => {
  const mutationRate = config.mutationRate

  const mutateBit = (bit: string): string => (Math.random() < mutationRate ? randomHex() : bit)

  const randomHex = (): string => Math.floor(Math.random() * 16).toString(16)

  const hexGenome = genomeToHex(genome)
  const splittedToGenes = hexGenome.split(' ')
  const mutatedGenes: string[] = []
  splittedToGenes.forEach((gene: string) => {
    const mutatedGene = gene.split('').map(mutateBit).join('')
    mutatedGenes.push(mutatedGene)
  })

  return hexToGenome(mutatedGenes)
}
