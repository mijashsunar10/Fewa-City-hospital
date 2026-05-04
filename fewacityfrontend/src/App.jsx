import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'

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
      </div>
    </Router>
  )
}

// Simple Home component for now
const Home = () => (
  <div className="py-20 text-center">
    <h1 className="text-4xl font-bold text-slate-800">Welcome to Fewa City Hospital</h1>
    <p className="text-slate-600 mt-4">This is your main content area.</p>
  </div>
)

export default App
