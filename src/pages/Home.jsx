import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import SearchBar from '../components/SearchBar'
import TempleCard from '../components/TempleCard'
import { FaStar, FaBolt, FaShieldAlt, FaCalendarCheck } from 'react-icons/fa'

const temples = [
  { name: 'Tirumala Temple', location: 'Andhra Pradesh', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80', tag: 'Popular' },
  { name: 'Shirdi Sai Baba', location: 'Maharashtra', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', tag: 'Trending' },
  { name: 'Meenakshi Temple', location: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80', tag: 'Heritage' },
  { name: 'Vaishno Devi', location: 'Jammu & Kashmir', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', tag: 'Pilgrimage' },
  { name: 'Golden Temple', location: 'Punjab', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', tag: 'Sacred' },
]

const features = [
  { icon: <FaStar />, title: 'Trusted Booking', text: 'Secure and verified temple reservations.' },
  { icon: <FaBolt />, title: 'Instant Confirmation', text: 'Get your slot confirmation in seconds.' },
  { icon: <FaShieldAlt />, title: 'Safe & Secure', text: 'Protected payments and account safety.' },
  { icon: <FaCalendarCheck />, title: 'Flexible Slots', text: 'Choose the darshan time that suits you.' },
]

const Home = () => {
  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const googleDatesUrl = `https://www.google.com/search?q=darshan+tickets+${encodeURIComponent(dateLabel)}&tbm=`

  return (
    <main>
      <Hero />
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Plan your visit</p>
          <h2>Browse temples and choose your ideal slot</h2>
        </div>
        <SearchBar />
        <div style={{ marginTop: 18 }}>
          <a
            href={googleDatesUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-light"
          >
            Flexible Dates on Google ({dateLabel})
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Why choose us</p>
          <h2>Everything you need for a smooth darshan</h2>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Popular temples</p>
          <h2>Explore sacred destinations near you</h2>
        </div>
        <div className="temples-grid">
          {temples.map((temple) => (
            <TempleCard key={temple.name} {...temple} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
