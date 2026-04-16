import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Detection from './pages/Detection'
import EmergencyMap from './pages/EmergencyMap'

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/emergency-map" element={<EmergencyMap />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
