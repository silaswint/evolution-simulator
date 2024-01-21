import { convertBase } from '@/utils/math/convertBase'
import { config } from '@/utils/config'
import { type Genome } from '@/utils/types/Genome'
import { type Gene } from '@/utils/types/Gene'
import { padWithZeros } from '@/utils/math/padWithZeros'

const randomBinary = (): number => Math.floor(Math.random() * 2)

const generateRandomGenome = (): Genome => {
  return Array.from({ length: config.genomeSize }, () => ({
    sourceType: randomBinary().toString(),
    sourceId: Array.from({ length: 7 }, randomBinary).join(''),
    sinkType: randomBinary().toString(),
    sinkId: Array.from({ length: 7 }, randomBinary).join(''),
    weight: Array.from({ length: 16 }, randomBinary).join('')
  }))
}

const genomeToHex = (genome: Genome): string => {
  return genome.map(geneToHex).join(' ')
}

const geneToHex = (gen: Gene): string => {
  const binaryGene = `${gen.sourceType}${gen.sourceId}${gen.sinkType}${gen.sinkId}${gen.weight}`
  return convertBase.bin2hex(binaryGene)
}

const hexToGenome = (hexGene: string): Gene => {
  const binaryGene = padWithZeros(convertBase.hex2bin(hexGene), 32)
  return {
    sourceType: binaryGene[0],
    sourceId: binaryGene.substring(1, 8),
    sinkType: binaryGene[8],
    sinkId: binaryGene.substring(9, 16),
    weight: binaryGene.substring(16, 32)
  }
}

const mutateBit = (bit: string): string => (Math.random() < config.mutationRate ? randomHex() : bit)

const randomHex = (): string => Math.floor(Math.random() * 16).toString(16)

const mutateGenome = (genome: Genome): Genome => {
  const hexGenome = genomeToHex(genome)
  const mutatedGenes = hexGenome.split(' ').map((gene) => gene.split('').map(mutateBit).join(''))
  return mutatedGenes.map(hexToGenome)
}

export { generateRandomGenome, mutateGenome, genomeToHex, geneToHex }
