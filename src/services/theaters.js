const SEARCH_RADIUS_METERS = 25000
const PHOTON_URL = 'https://photon.komoot.io/api/'

export const getGoogleMapsDirectionsUrl = (theater) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${theater.lat},${theater.lon}`)}`

const getDistanceKm = (from, to) => {
  const radians = (degrees) => (degrees * Math.PI) / 180
  const latitudeDistance = radians(to.lat - from.lat)
  const longitudeDistance = radians(to.lon - from.lon)
  const value =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) *
    Math.sin(longitudeDistance / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

const getAddress = (properties) => {
  const parts = [
    properties.street,
    properties.locality || properties.district,
    properties.city || properties.county,
    properties.state,
    properties.postcode
  ]
  return parts.filter(Boolean).join(', ')
}

const getLocationName = async (location, signal) => {
  if (location.label !== 'Your current location') return location.label

  const url = new URL(`${PHOTON_URL}reverse`)
  url.searchParams.set('lat', String(location.lat))
  url.searchParams.set('lon', String(location.lon))
  url.searchParams.set('lang', 'en')
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Could not identify your area for theater search.')

  const feature = (await response.json()).features?.[0]
  const properties = feature?.properties || {}
  return [properties.city, properties.county, properties.state, properties.country]
    .filter((part, index, parts) => part && parts.indexOf(part) === index)
    .join(', ') || location.label
}

export const findLocation = async (query, signal) => {
  const url = new URL(PHOTON_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '1')
  url.searchParams.set('lang', 'en')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Location search is temporarily unavailable. Please try again.')

  const data = await response.json()
  const feature = data.features?.[0]
  const [lon, lat] = feature?.geometry?.coordinates || []
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('We could not find that place. Try a nearby city or area name.')
  }

  const properties = feature.properties || {}
  const label = [properties.name, properties.district, properties.city, properties.state, properties.country]
    .filter((part, index, parts) => part && parts.indexOf(part) === index)
    .join(', ')

  return { lat, lon, label: label || query }
}

export const findNearbyCinemas = async (location, signal) => {
  const locationName = await getLocationName(location, signal)
  const queries = ['cinema', 'theater'].map(async (term) => {
    const url = new URL(PHOTON_URL)
    url.searchParams.set('q', `${term} ${locationName}`)
    url.searchParams.set('lat', String(location.lat))
    url.searchParams.set('lon', String(location.lon))
    url.searchParams.set('limit', '50')
    url.searchParams.set('lang', 'en')

    const response = await fetch(url, { signal })
    if (!response.ok) {
      throw new Error('Nearby theater search is temporarily unavailable. Please try again in a moment.')
    }
    return response.json()
  })
  const results = await Promise.all(queries)
  const seen = new Set()

  return results.flatMap((data) => data.features || [])
    .map((feature) => {
      const [lon, lat] = feature.geometry?.coordinates || []
      const properties = feature.properties || {}
      const isCinema = properties.osm_key === 'amenity' && properties.osm_value === 'cinema'
      const isMovieTheater = properties.osm_key === 'amenity' &&
        properties.osm_value === 'theatre' &&
        /(cinema|cine|movie)/i.test(properties.name || '')
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        (!isCinema && !isMovieTheater) ||
        !properties.name
      ) return null
      const id = `${properties.osm_type}-${properties.osm_id}`
      if (seen.has(id)) return null
      seen.add(id)
      const distanceKm = getDistanceKm(location, { lat, lon })
      if (distanceKm > SEARCH_RADIUS_METERS / 1000) return null

      return {
        id,
        name: properties.name,
        address: getAddress(properties) || 'Address not listed',
        lat,
        lon,
        distanceKm
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
