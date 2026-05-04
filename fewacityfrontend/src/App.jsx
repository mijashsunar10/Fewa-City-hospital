import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import EmergencyContact from './components/EmergencyContact'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes here as you build them */}
          </Routes>
        </main>

        <footer className="bg-slate-900 text-white py-10 text-center">
          <p>&copy; 2026 Fewa City Hospital Pvt. Ltd. All Rights Reserved.</p>
        </footer>

        <EmergencyContact />
      </div>
    </Router>
  )
}

export default App
