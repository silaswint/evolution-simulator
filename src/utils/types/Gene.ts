export interface Gene {
  // 1 bit field: source of the connection is from an input sensory neuron or from an internal neuron
  sourceType: string

  // 7 bit field: identifier of which input neuron or which internal neuron
  // we take it as an unsigned value and take it modulo the number of neurons involved to tell exactly which one it refers to
  sourceId: string

  // 1 bit field: determines the sink of the connection, whether it goes to an internal neuron or to an output action neuron
  sinkType: string

  // 7 bit field: identifies exactly which internal neuron or exactly which output action neuron
  sinkId: string

  // 16 bit field: weight of the connection (goes from -32k to +32k) - we devide it by a constant, like 8000, 9000 or 10000 to make a smaller floating point range
  weight: string
}
