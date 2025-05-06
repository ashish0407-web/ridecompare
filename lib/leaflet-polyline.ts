// Add Polyline.encoded to Leaflet
// This is needed for decoding the polyline from OSRM

declare global {
  namespace L {
    namespace Polyline {
      function fromEncoded(encoded: string, options?: L.PolylineOptions): L.Polyline
    }
  }
}

// This function needs to be called once to extend Leaflet
export function initLeafletPolyline() {
  if (typeof window !== "undefined" && window.L) {
    // Add the fromEncoded function to L.Polyline
    L.Polyline.fromEncoded = (encoded, options) => {
      const points = decodePolyline(encoded)
      return L.polyline(points, options)
    }
  }
}

// Decode an encoded polyline string into a series of LatLng points
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = result & 1 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = result & 1 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push([lat * 1e-5, lng * 1e-5])
  }

  return points
}
