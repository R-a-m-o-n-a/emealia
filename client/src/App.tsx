import { useState } from 'react'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <section id="center">
                <div className="hero">
                    <img src={viteLogo} className="vite" alt="Vite logo" />
                </div>
                <div>
                    <h1>Get started</h1>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
                    </p>
                </div>
                <button type="button" className="counter" onClick={() => setCount((count) => count + 1)}>
                    Count is {count}
                </button>
            </section>

        </>
    )
}

export default App
