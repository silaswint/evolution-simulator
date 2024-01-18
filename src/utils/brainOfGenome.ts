import { evolutionConfig } from "@/utils/evolutionConfig";
import { Genome } from "@/utils/types/Genome";
import { convertBase } from "@/utils/convertBase";
import {
    SINK_TYPE_INTERNAL_NEURON,
    SINK_TYPE_OUTPUT_ACTION_NEURON,
    SOURCE_TYPE_INPUT_INTERNAL_NEURON,
    SOURCE_TYPE_INPUT_SENSORY_NEURON
} from "@/utils/consts/brain";

interface SensoryInputs {
    Slr: number; // pheromone gradient left-right
    Sfd: number; // pheromone gradient forward
    Sg: number; // pheromone density
    Age: number; // age
    Rnd: number; // random input
    Blr: number; // blockage left-right
    Osc: number; // oscillator
    Bfc: number; // blockage forward
    Plr: number; // population gradient left-right
    Pop: number; // population density
    Pfd: number; // population gradient forward
    LPf: number; // population long-range forward
    LMy: number; // last movement Y
    LBf: number; // blockage long-range forward
    LMx: number; // last movement X
    BDy: number; // north/south border distance
    Gen: number; // genetic similarity of fwd neighbor
    BDx: number; // east/west border distance
    Lx: number; // east/west world location
    BD: number; // nearest border distance
    Ly: number; // north/south world location
}

interface ActionOutputs {
    MvE: number; // Move East
    MvW: number; // Move West
    MvN: number; // Move North
    MvS: number; // Move South
    MvX: number; // Move X
    MvY: number; // Move Y
    Mfd: number; // Move Forward
    Res: number; // Responsiveness
    OSC: number; // Oscillator Period
    SG: number; // Signal 0
    Klf: number; // Kill Forward
    Mrv: number; // Move Reverse
    MvL: number; // Move Left
    MvR: number; // Move Right
    MRL: number; // Move Right-Left
    Mrn: number; // Move Random
    LPD: number; // Long Probe Distance
}

const generatedInnerNeurons = () => {
    const inner_neurons = [];

    for (let i = 0; i < evolutionConfig.innerNeurons; i++) {
        inner_neurons.push(1);
    }

    return inner_neurons;
}

interface Neurons {
    [sinkType: number]: {
        [sinkId: number]: number[];
    };
}

interface NeuronsCalculated {
    [sinkType: number]: {
        [sinkId: number]: number;
    };
}

export const brainOfGenome = (sensory_inputs:SensoryInputs, genome: Genome): ActionOutputs => {
    const sensoryInputsKeys: (keyof SensoryInputs)[] = Object.keys(sensory_inputs) as (keyof SensoryInputs)[];

    const inner_neurons = generatedInnerNeurons();

    let neurons: Neurons = {};

    // first loop for input sensory neurons
    for (const gen of genome) {
        const sourceType = Number(convertBase.hex2dec(gen.sourceType));
        const sourceId = Number(convertBase.hex2dec(gen.sourceId));
        const sinkType = Number(convertBase.hex2dec(gen.sinkType));
        const sinkId = Number(convertBase.hex2dec(gen.sinkId));
        const weight = Number(gen.weight);

        if (Number(sourceType) === SOURCE_TYPE_INPUT_SENSORY_NEURON) {
            neurons = Object.assign({}, neurons, {
                [sinkType]: {
                    [sinkId]: [
                        weight * Number(sensoryInputsKeys[sourceId])
                    ]
                }
            });
        }
    }

    // second loop for internal neurons
    for (const gen of genome) {
        const sourceType = Number(convertBase.hex2dec(gen.sourceType));
        const sourceId = Number(convertBase.hex2dec(gen.sourceId));
        const sinkType = Number(convertBase.hex2dec(gen.sinkType));
        const sinkId = Number(convertBase.hex2dec(gen.sinkId));
        const weight = Number(gen.weight);

        if (Number(sourceType) === SOURCE_TYPE_INPUT_INTERNAL_NEURON) {
            neurons = Object.assign({}, neurons, {
                [sinkType]: {
                    [sinkId]: [
                        weight * Number(inner_neurons[sourceId])
                    ]
                }
            });
        }
    }

    // third loop for giving all internal neurons the correct value
    let neurons_calculated: NeuronsCalculated = {};
    for (const sinkType in neurons) {
        if (Number(sinkType) === SINK_TYPE_INTERNAL_NEURON) {
            for (const sinkId in neurons[sinkType]) {
                neurons_calculated = Object.assign({}, neurons_calculated,{
                    [sinkType]: {
                        [sinkId]: Math.tanh(neurons[sinkType][sinkId].reduce((accumulator, currentValue) => accumulator + currentValue, 0))
                    }
                });
            }
        }
    }

    // fourth loop for giving all action output neurons the correct value
    for (const sinkType in neurons) {
        if (Number(sinkType) === SINK_TYPE_OUTPUT_ACTION_NEURON) {
            for (const sinkId in neurons[sinkType]) {
                neurons_calculated = Object.assign({}, neurons_calculated,{
                    [sinkType]: {
                        [sinkId]: Math.tanh(neurons[sinkType][sinkId].reduce((accumulator, currentValue) => accumulator + currentValue, 0))
                    }
                });
            }
        }
    }

    return {
        MvE: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][0]) ?? 0, // Move East
        MvW: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][1]) ?? 0, // Move West
        MvN: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][2]) ?? 0, // Move North
        MvS: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][3]) ?? 0, // Move South
        MvX: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][4]) ?? 0, // Move X
        MvY: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][5]) ?? 0, // Move Y
        Mfd: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][6]) ?? 0, // Move Forward
        Res: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][7]) ?? 0, // Responsiveness
        OSC: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][8]) ?? 0, // Oscillator Period
        SG: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][9]) ?? 0, // Signal 0
        Klf: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][10]) ?? 0, // Kill Forward
        Mrv: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][11]) ?? 0, // Move Reverse
        MvL: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][12]) ?? 0, // Move Left
        MvR: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][13]) ?? 0, // Move Right
        MRL: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][14]) ?? 0, // Move Right-Left
        Mrn: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][15]) ?? 0, // Move Random
        LPD: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][16]) ?? 0, // Long Probe Distance
    };
};
