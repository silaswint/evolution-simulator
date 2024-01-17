// src/utils/genomeUtils.ts
import {convertBase} from "@/utils/convertBase";
import {evolutionConfig} from "@/utils/evolutionConfig";

const weight_floating_point = 9000;

export const generateRandomGenome = (): string => {
    const randomBinary = () => Math.floor(Math.random() * 2);

    return generateGenome({
        sourceType: randomBinary().toString(),
        sourceId: Array.from({ length: 7 }, randomBinary).join(''),
        sinkType: Array.from({ length: 7 }, randomBinary).join(''),
        sinkId: Array.from({ length: 7 }, randomBinary).join(''),
        weight: Array.from({ length: 16 }, randomBinary).join('')
    });
};

interface Gen {
    // 1 bit field: source of the connection is from an input sensory neuron or from an internal neuron
    sourceType: string;

    // 7 bit field: identifier of which input neuron or which internal neuron
    // we take it as an unsigned value and take it modulo the number of neurons involved to tell exactly which one it refers to
    sourceId: string;

    // 1 bit field: determines the sink of the connection, whether it goes to an internal neuron or to an output action neuron
    sinkType: string;

    // 7 bit field: identifies exactly which internal neuron or exactly which output action neuron
    sinkId: string;

    // 16 bit field: weight of the connection (goes from -32k to +32k) - we devide it by a constant, like 8000, 9000 or 10000 to make a smaller floating point range
    weight: string;
}

export const generateGenome = (gen:Gen): string => {
    const smallerFloatingPointWeight = (weight: string) => {
        const decimalWeight = Number(convertBase.bin2dec(weight));
        return convertBase.dec2bin((decimalWeight / weight_floating_point).toString());
    };

    const idOfNeuron = (sourceId: string): string => {
        const decimalSourceId = Number(convertBase.bin2dec(sourceId));
        return (decimalSourceId % evolutionConfig.innerNeurons).toString(2).padStart(7, '0');
    }

    const generateGene = (): string => {
        // 1-Bit: Quelle (0 für sensorisches Eingangsneuron, 1 für internes Neuron)
        const sourceType = gen.sourceType;

        // 7-Bit: Index des Eingangsneurons oder internen Neurons
        const sourceId = idOfNeuron(gen.sourceId);

        // 1-Bit: Senke (0 für internes Neuron, 1 für Ausgangsaktionsneuron)
        const sinkType = gen.sinkType;

        // 7-Bit: Index des internen Neurons oder Ausgangsaktionsneurons
        const sinkId = gen.sinkId;

        // 16-Bit: Gewicht der Verbindung
        const weight = smallerFloatingPointWeight(gen.weight);

        const binaryGene = `${sourceType}${sourceId}${sinkType}${sinkId}${weight}`;

        // Hexadezimale Darstellung mit auf 8 Zeichen begrenzter Länge
        return convertBase.bin2hex(binaryGene);
    };

    const genes = [];
    for (let i = 0; i < evolutionConfig.genomeSize; i++) {
        genes.push(generateGene());
    }

    return genes.join(' ');
};

export const mutateGenome = (genome: string, mutationRate: number): string => {
    const mutateBit = (bit: string): string => (Math.random() < mutationRate ? randomHex() : bit);

    const randomHex = () => Math.floor(Math.random() * 16).toString(16);

    return genome
        .split('')
        .map(mutateBit)
        .join('');
};
