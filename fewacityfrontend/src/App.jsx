import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
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

        <Footer />

        <EmergencyContact />
      </div>
    </Router>
  )
}

export default App
