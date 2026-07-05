import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  return (
    <form className="search-bar">
      <FaSearch />
      <input type="text" placeholder="Search temple, city or deity" />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar
