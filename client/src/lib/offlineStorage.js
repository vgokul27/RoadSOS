// Offline Storage Utilities

export const CACHE_KEYS = {
  LOCATION: 'roadsos_location',
  SERVICES: 'roadsos_services',
  COUNTRY: 'roadsos_country',
  LAST_UPDATED: 'roadsos_last_updated',
};

export const cacheLocation = (location) => {
  try {
    localStorage.setItem(
      CACHE_KEYS.LOCATION,
      JSON.stringify({ ...location, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Failed to cache location:', error);
  }
};

export const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.LOCATION);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Failed to get cached location:', error);
    return null;
  }
};

export const cacheServices = (services) => {
  try {
    localStorage.setItem(
      CACHE_KEYS.SERVICES,
      JSON.stringify({ data: services, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Failed to cache services:', error);
  }
};

export const getCachedServices = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.SERVICES);
    return cached ? JSON.parse(cached).data : [];
  } catch (error) {
    console.error('Failed to get cached services:', error);
    return [];
  }
};

export const cacheCountry = (country) => {
  try {
    localStorage.setItem(CACHE_KEYS.COUNTRY, country);
  } catch (error) {
    console.error('Failed to cache country:', error);
  }
};

export const getCachedCountry = () => {
  try {
    return localStorage.getItem(CACHE_KEYS.COUNTRY) || 'India';
  } catch (error) {
    console.error('Failed to get cached country:', error);
    return 'India';
  }
};

export const clearCache = () => {
  try {
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};
