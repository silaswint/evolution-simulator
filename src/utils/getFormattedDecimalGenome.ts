import type { Genome } from '@/utils/types/Genome'
import type { Gene } from '@/utils/types/Gene'
import { convertBase } from '@/utils/math/convertBase'
import {
  NUM_ACTION_OUTPUT_NEURONS,
  NUM_SENSORY_NEURONS,
  SINK_TYPE_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON,
  WEIGHT_FLOATING_POINT
} from '@/utils/consts/brain'
import { config } from '@/utils/config'
import type { DecimalGenome } from '@/utils/types/DecimalGenome'
import { geneToHex } from '@/utils/genome'
import { type DecimalGene } from '@/utils/types/DecimalGene'

interface SplitResult {
  firstCharacter: string | null
  restOfString: string
}

const splitFirstCharacter = (str: string): SplitResult => {
  if (str.length === 0) {
    return { firstCharacter: null, restOfString: '' }
  }

  const [firstCharacter, ...restOfString] = str.split('')
  return { firstCharacter, restOfString: restOfString.join('') }
}

const weight = (geneWeight: string): string => {
  const { firstCharacter, restOfString } = splitFirstCharacter(geneWeight)
  const weight = convertBase.bin2dec(restOfString)

  return firstCharacter === '0' ? (-weight).toString() : weight
}

const sourceId = (sourceType: string, sourceId: string, sourceLayerId: string): number => {
  return Number(sourceType) === SOURCE_TYPE_INPUT_INTERNAL_NEURON
    ? Number(sourceId) % config.innerNeurons[Number(sourceLayerId)]
    : Number(sourceId) % NUM_SENSORY_NEURONS
}

const sinkId = (sinkType: string, sinkId: string, sinkLayerId: string): number => {
  return Number(sinkType) === SINK_TYPE_INTERNAL_NEURON
    ? Number(sinkId) % config.innerNeurons[Number(sinkLayerId)]
    : Number(sinkId) % NUM_ACTION_OUTPUT_NEURONS
}

const sourceLayerId = (sourceLayerId: string, sourceType: string): string => {
  const decimalSourceLayerId = convertBase.bin2dec(sourceLayerId)
  const decimalSourceType = convertBase.bin2dec(sourceType)

  const decimalSourceLayerIdAsNumber = Number(decimalSourceLayerId)
  const result = Number(decimalSourceType) === SOURCE_TYPE_INPUT_INTERNAL_NEURON
    ? decimalSourceLayerIdAsNumber % config.innerNeurons.length
    : 0

  return result.toString()
}

const sinkLayerId = (sinkLayerId: string, sinkType: string): string => {
  const decimalSinkLayerId = convertBase.bin2dec(sinkLayerId)
  const decimalSinkType = convertBase.bin2dec(sinkType)

  const decimalSinkLayerIdAsNumber = Number(decimalSinkLayerId)

  const result = Number(decimalSinkType) === SINK_TYPE_INTERNAL_NEURON
    ? decimalSinkLayerIdAsNumber % config.innerNeurons.length
    : 0

  return result.toString()
}

export const getFormattedDecimalGenome = (genome: Genome): DecimalGenome => {
  return genome.map((gene: Gene): DecimalGene => {
    const decimalGene: Gene = {
      sourceType: convertBase.bin2dec(gene.sourceType),
      sourceId: convertBase.bin2dec(gene.sourceId),
      sourceLayerId: sourceLayerId(gene.sourceLayerId, gene.sourceType),
      sinkType: convertBase.bin2dec(gene.sinkType),
      sinkId: convertBase.bin2dec(gene.sinkId),
      sinkLayerId: sinkLayerId(gene.sinkLayerId, gene.sinkType),
      weight: weight(gene.weight)
    }

    return {
      sourceType: Number(decimalGene.sourceType),
      sourceId: sourceId(decimalGene.sourceType, decimalGene.sourceId, decimalGene.sourceLayerId),
      sourceLayerId: Number(decimalGene.sourceLayerId),
      sinkType: Number(decimalGene.sinkType),
      sinkId: sinkId(decimalGene.sinkType, decimalGene.sinkId, decimalGene.sinkLayerId),
      sinkLayerId: Number(decimalGene.sinkLayerId),
      weight: Number(decimalGene.weight) / WEIGHT_FLOATING_POINT,
      hex: geneToHex(gene)
    }
  })
}
