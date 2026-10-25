export const movies = [
  {
    id: 'dhurandhar-the-revenge',
    title: 'Dhurandhar: The Revenge',
    certificate: 'A',
    genres: ['Action', 'Thriller'],
    language: 'Hindi',
    industry: 'Bollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Dhurandhar-_The_Revenge_poster.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Dhurandhar-_The_Revenge_poster.jpg',
    description: 'A Hindi-language action thriller and the next chapter in the Dhurandhar story.'
  },
  {
    id: 'border-2',
    title: 'Border 2',
    certificate: 'U/A',
    genres: ['War', 'Action', 'Drama'],
    language: 'Hindi',
    industry: 'Bollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/2/26/Border_2_Poster.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Border_2_Poster.jpg',
    description: 'A Hindi war drama following Indian armed forces during the 1971 conflict.'
  },
  {
    id: 'hanuman-ansh',
    title: 'Hanuman Ansh',
    certificate: 'U/A',
    genres: ['Drama', 'Mythology'],
    language: 'Hindi',
    industry: 'Bollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0e/Official_poster_for_the_Hanuman_Ansh_%282026%29_film.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Official_poster_for_the_Hanuman_Ansh_(2026)_film.jpg',
    description: 'A Hindi-language mythological drama inspired by the story of Hanuman.'
  },
  {
    id: 'bethlehem-kudumba-unit',
    title: 'Bethlehem Kudumba Unit',
    certificate: 'U',
    genres: ['Family', 'Drama'],
    language: 'Malayalam',
    industry: 'Mollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Bethlehem_Kudumba_Unit_Movie_Poster.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Bethlehem_Kudumba_Unit_Movie_Poster.jpg',
    description: 'A Malayalam family drama centered on the Bethlehem household.'
  },
  {
    id: 'peddi',
    title: 'Peddi',
    certificate: 'U/A',
    genres: ['Action', 'Drama', 'Sports'],
    language: 'Telugu',
    industry: 'Tollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/2/26/Peddi_Poster.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Peddi_Poster.jpg',
    description: 'A Telugu-language sports action drama starring Ram Charan.'
  },
  {
    id: 'jailer-2',
    title: 'Jailer 2',
    certificate: 'U/A',
    genres: ['Action', 'Comedy'],
    language: 'Tamil',
    industry: 'Kollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Jailer_2_poster.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Jailer_2_poster.jpg',
    description: 'Rajinikanth returns in the Tamil action-comedy sequel to Jailer.'
  },
  {
    id: 'mirzapur-the-movie',
    title: 'Mirzapur: The Movie',
    certificate: 'A',
    genres: ['Action', 'Crime', 'Thriller'],
    language: 'Hindi',
    industry: 'Bollywood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/4/40/Mirzapur_%28film%29.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Mirzapur_(film).jpg',
    description: 'The Mirzapur crime saga continues in a Hindi-language feature film.'
  },
  {
    id: 'toxic',
    title: 'Toxic',
    certificate: 'U/A',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'Kannada',
    industry: 'Sandalwood',
    releaseYear: 2026,
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Toxic-_A_Fairy_Tale_for_Grown-Ups_poster.jpg',
    posterSource: 'https://en.wikipedia.org/wiki/File:Toxic-_A_Fairy_Tale_for_Grown-Ups_poster.jpg',
    description: 'A Kannada gangster action drama directed by Geetu Mohandas.'
  }
]

export const showtimes = ['10:30 AM', '1:45 PM', '4:30 PM', '7:15 PM', '9:50 PM']

export const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getShowDates = () =>
  Array.from({ length: 5 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    return {
      value: getLocalDate(date),
      day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
      label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }
  })

export const readSavedTickets = () => {
  try {
    const tickets = JSON.parse(localStorage.getItem('bookMyTickets') || '[]')
    return Array.isArray(tickets) ? tickets : []
  } catch (error) {
    console.error('Could not read saved tickets:', error)
    return []
  }
}
