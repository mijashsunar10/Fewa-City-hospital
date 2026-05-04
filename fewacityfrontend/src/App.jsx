import { useState } from 'react'
import { Activity, Shield, Clock, HeartPulse } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-rose-600 w-8 h-8" />
          <span className="text-2xl font-bold text-slate-800 tracking-tight">Fewacity Hospital</span>
        </div>
        <div className="flex gap-6 text-slate-600 font-medium">
          <a href="#" className="hover:text-rose-600 transition-colors">Find a Doctor</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Services</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Contact</a>
        </div>
        <button className="bg-rose-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-rose-700 transition-all shadow-md active:scale-95">
          Book Appointment
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-rose-100 text-rose-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Trusted Healthcare
            </span>
            <h1 className="text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
              Compassionate Care for a <span className="text-rose-600">Healthier You.</span>
            </h1>
            <p className="text-xl text-slate-600 mt-6 leading-relaxed">
              Experience world-class medical services at Fewacity Hospital. We combine advanced technology with human touch.
            </p>
            
            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setCount(count + 1)}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Patients Served: {count}
              </button>
              <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
              <Activity className="text-blue-500 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">24/7 ER</h3>
              <p className="text-slate-500 mt-2">Emergency services always available.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow mt-8">
              <Shield className="text-green-500 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Expert Staff</h3>
              <p className="text-slate-500 mt-2">Top rated doctors and nurses.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
              <Clock className="text-purple-500 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Fast Results</h3>
              <p className="text-slate-500 mt-2">Quick diagnosis and lab work.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow mt-8">
              <HeartPulse className="text-rose-500 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">Modern Labs</h3>
              <p className="text-slate-500 mt-2">State of the art technology.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
