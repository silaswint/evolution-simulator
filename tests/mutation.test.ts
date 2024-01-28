import { generateRandomGenome, mutateGenome } from '@/utils/genome'
import { config } from '@/utils/config/config'

describe('mutateGenome', () => {
  it('should keep the mutated genome unchanged for 50 random genomes', () => {
    config.mutationRate = 0

    // Create 50 random genomes
    for (let i = 0; i < 50; i++) {
      const genome = generateRandomGenome()
      const mutatedGenome = mutateGenome(genome)

      // Compare each mutated genome with its original
      expect(mutatedGenome).toStrictEqual(genome)
    }
  })
})
