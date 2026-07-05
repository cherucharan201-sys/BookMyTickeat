import TempleCard from '../components/TempleCard'

const temples = [
  { name: 'Tirumala Temple', location: 'Andhra Pradesh', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80', tag: 'Popular' },
  { name: 'Shirdi Sai Baba', location: 'Maharashtra', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', tag: 'Trending' },
  { name: 'Meenakshi Temple', location: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80', tag: 'Heritage' },
  { name: 'Kedarnath', location: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80', tag: 'Mountain' },
  { name: 'Vaishno Devi', location: 'Jammu & Kashmir', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', tag: 'Pilgrimage' },
  { name: 'Golden Temple', location: 'Punjab', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', tag: 'Sacred' },
  { name: 'Ramanathaswamy Temple', location: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80', tag: 'Coastal' },
  { name: 'Somnath Temple', location: 'Gujarat', image: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=900&q=80', tag: 'Heritage' },
  { name: 'Badrinath Temple', location: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80', tag: 'Himalayan' },
  { name: 'Jagannath Temple', location: 'Odisha', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80', tag: 'Coastal' },
]

const Temples = () => {
  return (
    <section className="page-card">
      <div className="section-heading">
        <p className="eyebrow">Temple Listing</p>
        <h2>Choose a temple for your next darshan</h2>
      </div>
      <div className="temples-grid">
        {temples.map((temple) => (
          <TempleCard key={temple.name} {...temple} />
        ))}
      </div>
    </section>
  )
}

export default Temples
