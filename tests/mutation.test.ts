import { generateRandomGenome, mutateGenome } from '@/utils/genome'
import { config } from '@/utils/config/config'

describe('mutateGenome', () => {
  it('should keep the first element unchanged', () => {
    config.mutationRate = 0
    const genome = generateRandomGenome()
    const mutatedGenome = mutateGenome(genome)

    expect(mutatedGenome).toStrictEqual(genome)
  })
})
