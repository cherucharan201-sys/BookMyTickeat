import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight, FaClock, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa'

const Hero = () => {
  return (
    <section className="hero-section">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow">Fast • Secure • Easy</p>
        <h1>Book Your Darshan Without Standing in Long Queues</h1>
        <p className="hero-text">
          Reserve temple visits online, choose your preferred slot, and enjoy a smooth spiritual journey.
        </p>
        <div className="hero-actions">
          <Link to="/temples" className="btn btn-dark">
            Book Now <FaArrowRight />
          </Link>
          <Link to="/about" className="btn btn-light">
            Explore Temples
          </Link>
        </div>
        <div className="hero-badges">
          <span><FaClock /> Instant slots</span>
          <span><FaShieldAlt /> Secure booking</span>
          <span><FaCalendarAlt /> Flexible dates</span>
        </div>
      </motion.div>

      <motion.div
        className="hero-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="hero-card-inner">
          <h3 className="hero-card-title">Popular this week</h3>
          <ul>
            <li>🛕 Tirumala Temple</li>
            <li>🛕 Shirdi Saibaba</li>
            <li>🛕 Meenakshi Temple</li>
          </ul>
          <p>Trusted by thousands of pilgrims every month.</p>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
