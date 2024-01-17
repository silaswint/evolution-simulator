// src/utils/genomeUtils.ts
export const generateRandomGenome = (genomeSize: number): string => {
    const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

    const randomGenome = [];
    for (let i = 0; i < genomeSize; i++) {
        const hexGroup = Array.from({ length: 4 }, () => randomHex()).join('');
        randomGenome.push(hexGroup);
    }

    return randomGenome.join(' ');
};

export const mutateGenome = (genome: string, mutationRate: number): string => {
    const mutateBit = (bit: string): string => (Math.random() < mutationRate ? randomHex() : bit);

    const randomHex = () => Math.floor(Math.random() * 16).toString(16);

    return genome
        .split('')
        .map(mutateBit)
        .join('');
};
