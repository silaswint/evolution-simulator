import { type Genome } from '@/utils/types/Genome'
import { type Gene } from '@/utils/types/Gene'
import { convertBase } from '@/utils/math/convertBase'
import {
  NUM_ACTION_OUTPUT_NEURONS,
  NUM_SENSORY_NEURONS,
  SINK_TYPE_INTERNAL_NEURON,
  SOURCE_TYPE_INPUT_INTERNAL_NEURON, WEIGHT_FLOATING_POINT
} from '@/utils/consts/brain'
import { config } from '@/utils/config'
import { type DecimalGenome } from '@/utils/types/DecimalGenome'
import { genomeToHex } from '@/utils/genome'

interface SplitResult {
  firstCharacter: string | null
  restOfString: string
}

const splitFirstCharacter = (str: string): SplitResult => {
  if (str.length === 0) {
    return { firstCharacter: null, restOfString: '' }
  }

  const firstCharacter = str.charAt(0)
  const restOfString = str.slice(1)

  return { firstCharacter, restOfString }
}

export const getFormattedDecimalGenome = (genome: Genome): DecimalGenome => {
  return genome.map((gene, index) => {
    const splittedFirstCharacterOfWeight = splitFirstCharacter(gene.weight)
    const weight = convertBase.bin2dec(splittedFirstCharacterOfWeight.restOfString)

    const decimalGene: Gene = {
      sourceType: convertBase.bin2dec(gene.sourceType),
      sourceId: convertBase.bin2dec(gene.sourceId),
      sinkType: convertBase.bin2dec(gene.sinkType),
      sinkId: convertBase.bin2dec(gene.sinkId),
      weight: splittedFirstCharacterOfWeight.firstCharacter === '0' ? (-weight).toString() : weight
    }

    return {
      sourceType: Number(decimalGene.sourceType),
      sourceId: Number(decimalGene.sourceId) === SOURCE_TYPE_INPUT_INTERNAL_NEURON ? Number(decimalGene.sourceId) % config.innerNeurons : Number(decimalGene.sourceId) % NUM_SENSORY_NEURONS,
      sinkType: Number(decimalGene.sinkType),
      sinkId: Number(decimalGene.sinkId) === SINK_TYPE_INTERNAL_NEURON ? Number(decimalGene.sinkId) % config.innerNeurons : Number(decimalGene.sinkId) % NUM_ACTION_OUTPUT_NEURONS,
      weight: Number(decimalGene.weight) / WEIGHT_FLOATING_POINT,
      hex: genomeToHex([gene])
    }
  })
}
