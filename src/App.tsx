import { Stage } from '@pixi/react'
import React from 'react'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { Map } from '@/components/Map'

const mapSize = evolutionConfig.mapSize
const App: React.FC = () => {
  return (
        <Stage width={mapSize.width} height={mapSize.height} options={{ backgroundColor: 0xeef1f5 }}>
            <Map />
        </Stage>
  )
}

export default App
