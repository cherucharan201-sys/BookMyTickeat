import { Link, useParams } from 'react-router-dom'

const templeData = {
  'Tirumala Temple': {
    location: 'Tirupati, Andhra Pradesh',
    description: 'Experience a divine visit with pre-booked slots, guided access, and a comfortable journey.',
    bestTime: 'Early Morning',
    slots: '5:00 AM, 7:00 AM, 9:00 AM'
  },
  'Shirdi Sai Baba': {
    location: 'Shirdi, Maharashtra',
    description: 'Visit Saibaba temple with easy bookings, secure darshan slots, and live updates.',
    bestTime: 'Morning',
    slots: '6:00 AM, 9:00 AM, 12:00 PM'
  },
  'Meenakshi Temple': {
    location: 'Madurai, Tamil Nadu',
    description: 'Discover the historic Meenakshi Amman temple with a planned darshan experience.',
    bestTime: 'Afternoon',
    slots: '10:00 AM, 1:00 PM, 4:00 PM'
  },
  'Vaishno Devi': {
    location: 'Katra, Jammu & Kashmir',
    description: 'Secure your Vaishno Devi darshan and travel with trusted pilgrimage support.',
    bestTime: 'Morning',
    slots: '7:00 AM, 10:00 AM, 1:00 PM'
  },
  'Golden Temple': {
    location: 'Amritsar, Punjab',
    description: 'Book your visit to the Golden Temple and enjoy a peaceful spiritual experience.',
    bestTime: 'Evening',
    slots: '6:00 AM, 10:00 AM, 6:00 PM'
  }
}

const TempleDetails = () => {
  const params = useParams()
  const templeName = params.name ? decodeURIComponent(params.name) : 'Tirumala Temple'
  const temple = templeData[templeName] || templeData['Tirumala Temple']

  return (
    <section className="page-card details-card">
      <p className="eyebrow">Temple Details</p>
      <h2>{templeName}</h2>
      <p>{temple.description}</p>
      <div className="details-box">
        <p>Location: {temple.location}</p>
        <p>Best time: {temple.bestTime}</p>
        <p>Available Slots: {temple.slots}</p>
      </div>
      <div style={{ marginTop: 18 }}>
        <Link to={`/booking?temple=${encodeURIComponent(templeName)}`} className="btn btn-dark">
          Book Darshan for {templeName}
        </Link>
      </div>
    </section>
  )
}

export default TempleDetails
