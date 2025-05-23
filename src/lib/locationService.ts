// src/lib/locationService.ts
export interface LocationCoordinates {
  lng: number;
  lat: number;
}

export class LocationService {
  private static readonly cityCoordinates: Record<string, LocationCoordinates> = {
    'washington dc': { lng: -77.0369, lat: 38.9072 },
    'arlington': { lng: -77.0847, lat: 38.8795 },
    'san francisco': { lng: -122.4194, lat: 37.7749 },
    'new york': { lng: -74.0060, lat: 40.7128 },
    'los angeles': { lng: -118.2437, lat: 34.0522 },
    'chicago': { lng: -87.6298, lat: 41.8781 },
    'boston': { lng: -71.0589, lat: 42.3601 },
    'seattle': { lng: -122.3321, lat: 47.6062 },
    'austin': { lng: -97.7431, lat: 30.2672 }
  };

  static getCoordinatesFromAddress(address: string): LocationCoordinates {
    const lowerAddress = address.toLowerCase();
    
    for (const [city, coords] of Object.entries(this.cityCoordinates)) {
      if (lowerAddress.includes(city)) {
        return {
          lng: coords.lng + (Math.random() - 0.5) * 0.1,
          lat: coords.lat + (Math.random() - 0.5) * 0.1
        };
      }
    }
    
    // Default to US center with random offset
    return {
      lng: -95.7129 + (Math.random() - 0.5) * 20,
      lat: 37.0902 + (Math.random() - 0.5) * 10
    };
  }

  static parseLocation(location: any): LocationCoordinates | null {
    try {
      if (!location) return null;
      
      if (typeof location === 'string') {
        if (location.startsWith('POINT')) {
          const matches = location.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
          if (matches) {
            return {
              lng: parseFloat(matches[1]),
              lat: parseFloat(matches[2])
            };
          }
        }
        
        if (location.includes(',')) {
          const [lng, lat] = location.split(',').map(Number);
          if (!isNaN(lng) && !isNaN(lat)) {
            return { lng, lat };
          }
        }
      }
      
      if (typeof location === 'object' && location !== null) {
        if ('x' in location && 'y' in location) {
          return {
            lng: parseFloat(location.x),
            lat: parseFloat(location.y)
          };
        }
      }
      
      return null;
    } catch (err) {
      console.error('Error parsing location:', err);
      return null;
    }
  }
}
