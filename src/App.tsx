import { BlurFilter } from 'pixi.js'
import { Stage, Container, Text } from '@pixi/react'
import React, { useMemo } from 'react'

export const App: React.FC = () => {
  const blurFilter = useMemo(() => new BlurFilter(4), [])

  return (
        <Stage options={{ backgroundColor: 0xeef1f5 }}>
            <Container x={400} y={330} >
                <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} filters={[blurFilter]} />
            </Container>
        </Stage>
  )
}

export default App
