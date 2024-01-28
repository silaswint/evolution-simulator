import { generateRandomGenome, mutateGenome } from '@/utils/genome'

describe('mutateGenome', () => {
  it('should keep the first element unchanged', () => {
    const genome = generateRandomGenome()
    const mutatedGenome = mutateGenome(genome)

    expect(mutatedGenome[0]).toStrictEqual(genome[0])
  })
})
