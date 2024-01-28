import { convertBase } from '@/utils/math/convertBase'
import { config } from '@/utils/config/config'
import { type Genome } from '@/utils/types/Genome'
import { type Gene } from '@/utils/types/Gene'
import { padWithZeros } from '@/utils/math/padWithZeros'
import { NUM_ACTION_OUTPUT_NEURONS, NUM_SENSORY_NEURONS } from '@/utils/consts/brain'
import { type CalculateSizeOfHexGen } from '@/utils/types/CalculateSizeOfHexGen'
import { Map } from 'immutable'
import { arraySum } from '@/utils/math/arraySum'

const neededNumberOfDigits = (...numbersToMax: number[]): number => {
  return convertBase.dec2bin((Math.max(...numbersToMax)).toString()).length
}

const calculateSizeOfHexGen = (): CalculateSizeOfHexGen => {
  return {
    sourceType: 1,
    sourceId: neededNumberOfDigits(...config.innerNeurons, NUM_SENSORY_NEURONS),
    sourceLayerId: neededNumberOfDigits(...config.innerNeurons),
    sinkType: 1,
    sinkId: neededNumberOfDigits(...config.innerNeurons, NUM_ACTION_OUTPUT_NEURONS),
    sinkLayerId: neededNumberOfDigits(...config.innerNeurons),
    weight: 16
  }
}

const calculatedSizeOfHexGen = calculateSizeOfHexGen()

const randomBinary = (): number => Math.floor(Math.random() * 2)

const randomBits = (length: number): string => {
  return Array.from({ length }, randomBinary).join('')
}

const generateRandomGenome = (): Genome => {
  return Array.from({ length: config.genomeSize }, () => ({
    sourceType: randomBits(calculatedSizeOfHexGen.sourceType),
    sourceId: randomBits(calculatedSizeOfHexGen.sourceId),
    sourceLayerId: randomBits(calculatedSizeOfHexGen.sourceLayerId),
    sinkType: randomBits(calculatedSizeOfHexGen.sinkType),
    sinkId: randomBits(calculatedSizeOfHexGen.sinkId),
    sinkLayerId: randomBits(calculatedSizeOfHexGen.sinkLayerId),
    weight: randomBits(calculatedSizeOfHexGen.weight)
  }))
}

const genomeToHex = (genome: Genome): string => {
  return genome.map(geneToHex).join(' ')
}

const geneToHex = (gen: Gene): string => {
  const binaryGene = `${gen.sourceType}${gen.sourceId}${gen.sourceLayerId}${gen.sinkType}${gen.sinkId}${gen.sinkLayerId}${gen.weight}`
  return convertBase.bin2hex(binaryGene)
}

const getTotalNumberOfNeededDigits = (): number => {
  return arraySum(Object.values(calculatedSizeOfHexGen) as number[])
}

const totalNumberOfNeededDigits = getTotalNumberOfNeededDigits()

const hexToGene = (hexGene: string): Gene => {
  const binaryGene = padWithZeros(convertBase.hex2bin(hexGene), totalNumberOfNeededDigits)

  let test: Gene = {
    sourceType: '',
    sourceId: '',
    sourceLayerId: '',
    sinkType: '',
    sinkId: '',
    sinkLayerId: '',
    weight: ''
  }

  let i = 0
  test = Map(test).map((_value, key) => {
    const result = binaryGene.substring(i, i + calculatedSizeOfHexGen[key])
    i++
    return result
  }).toJS() as unknown as Gene

  return test
}

const mutateBit = (bit: string): string => (Math.random() < config.mutationRate ? randomHex() : bit)

const randomHex = (): string => Math.floor(Math.random() * 16).toString(16)

const mutateGenome = (genome: Genome): Genome => {
  const hexGenome = genomeToHex(genome)
  const mutatedGenes = hexGenome.split(' ').map((gene) => gene.split('').map(mutateBit).join(''))
  return mutatedGenes.map(hexToGene)
}

export { generateRandomGenome, mutateGenome, genomeToHex, geneToHex }
