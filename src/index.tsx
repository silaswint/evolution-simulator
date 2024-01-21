// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import WindowContextProvider from '@/components/WindowContextProvider'

const rootElement = document.getElementById('root')
if (rootElement == null) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(rootElement)

root.render(
    <React.StrictMode>
        <WindowContextProvider>
            <App />
        </WindowContextProvider>
    </React.StrictMode>
)
