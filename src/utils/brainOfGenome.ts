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
    age: number;
    random: number;
    currentPositionY: number;
    currentPositionX: number;
    generation: number;
    sizeOfMapX: number;
    sizeOfMapY: number;
    population: number;
}

interface ActionOutputs {
    moveX: number;
    moveY: number;
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
        moveX: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][0]) ?? 0,
        moveY: Math.tanh(neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON] && neurons_calculated[SINK_TYPE_OUTPUT_ACTION_NEURON][1]) ?? 0,
    };
};
