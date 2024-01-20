// src/utils/genomeUtils.ts
import { convertBase } from '@/utils/math/convertBase'
import { config } from '@/utils/config'
import { type Genome } from '@/utils/types/Genome'
import { type Gene } from '@/utils/types/Gene'
import { padWithZeros } from '@/utils/math/padWithZeros'

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

  return genes
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
    const paddedBinaryGene = padWithZeros(binaryGene, 32)

    return {
      sourceType: paddedBinaryGene[0],
      sourceId: paddedBinaryGene.substring(1, 8),
      sinkType: paddedBinaryGene[8],
      sinkId: paddedBinaryGene.substring(9, 16),
      weight: paddedBinaryGene.substring(16, 32)
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
