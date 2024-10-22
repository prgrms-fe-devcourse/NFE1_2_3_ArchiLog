import { useState } from 'react'
import './App.css'
import Project from './components/ProjectPage/Project';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Project/>
    </>
  )
}

export default App
