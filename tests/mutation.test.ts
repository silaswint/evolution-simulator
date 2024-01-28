import { generateRandomGenome, mutateGenome } from '@/utils/genome'
import { config } from '@/utils/config/config'

describe('mutateGenome', () => {
  it('should keep the mutated genome unchanged for 50 random genomes', () => {
    config.mutationRate = 0

    // Erstelle 50 zufällige Genome
    for (let i = 0; i < 50; i++) {
      const genome = generateRandomGenome()
      const mutatedGenome = mutateGenome(genome)

      // Vergleiche jedes mutierte Genome mit seinem Original
      expect(mutatedGenome).toStrictEqual(genome)
    }
  })
})
