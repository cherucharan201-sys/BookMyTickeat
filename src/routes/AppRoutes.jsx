import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Movies from '../pages/Movies.jsx'
import MovieDetails from '../pages/MovieDetails.jsx'
import Booking from '../pages/Booking.jsx'
import MyBookings from '../pages/MyBookings.jsx'
import Theaters from '../pages/Theaters.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/movies" element={<Movies />} />
    <Route path="/theaters" element={<Theaters />} />
    <Route path="/movie/:id" element={<MovieDetails />} />
    <Route path="/booking/:id" element={<Booking />} />
    <Route path="/bookings" element={<MyBookings />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
