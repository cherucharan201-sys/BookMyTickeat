import API_URL from '../config/api.js'

const request = async (path, token, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Movie ticket service is unavailable.')
  }
  return data
}

export const saveMovieTicket = (ticket, token) =>
  request('/api/movie-tickets', token, {
    method: 'POST',
    body: JSON.stringify(ticket)
  })

export const getMovieTickets = (token) =>
  request('/api/movie-tickets', token)
