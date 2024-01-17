// src/utils/genomeUtils.ts
export const generateRandomGenome = (genomeSize: number): string => {
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);

    let randomGenome = '';
    for (let i = 0; i < genomeSize * 8; i++) {
        randomGenome += randomHex();
    }

    return randomGenome;
};

export const mutateGenome = (genome: string, mutationRate: number): string => {
    const mutateBit = (bit: string): string => (Math.random() < mutationRate ? randomHex() : bit);

    const randomHex = () => Math.floor(Math.random() * 16).toString(16);

    return genome
        .split('')
        .map(mutateBit)
        .join('');
};
