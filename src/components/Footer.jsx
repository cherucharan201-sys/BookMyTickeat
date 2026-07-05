import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <h3>DarshanHome</h3>
        <p>Book divine visits with ease, safety, and comfort.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <Link to="/temples">Popular Temples</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div>
        <h4>Support</h4>
        <p>cherucharan201@gmail.com</p>
        <p>+93 90767012</p>
      </div>
    </footer>
  )
}

export default Footer
