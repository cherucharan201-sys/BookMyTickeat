import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Temples from '../pages/Temples'
import TempleDetails from '../pages/TempleDetails'
import Booking from '../pages/Booking'
import MyBookings from '../pages/MyBookings'
import Profile from '../pages/Profile'
import Contact from '../pages/Contact'
import About from '../pages/About'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/temples" element={<Temples />} />
      <Route path="/temple/:name" element={<TempleDetails />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default AppRoutes
