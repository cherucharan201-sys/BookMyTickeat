import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext.jsx'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <AppRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
