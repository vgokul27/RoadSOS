// Geolocation and Location Services

export const getCountryByCode = (code) => {
  const countries = {
    India: {
      name: 'India',
      code: 'IN',
      emergencyNumber: '112',
      police: '100',
      ambulance: '108',
      lat: 20.5937,
      lng: 78.9629,
    },
    USA: {
      name: 'United States',
      code: 'US',
      emergencyNumber: '911',
      police: '911',
      ambulance: '911',
      lat: 37.0902,
      lng: -95.7129,
    },
    UK: {
      name: 'United Kingdom',
      code: 'GB',
      emergencyNumber: '999',
      police: '999',
      ambulance: '999',
      lat: 55.3781,
      lng: -3.436,
    },
  };
  return countries[code] || countries['India'];
};

export const detectCountryByIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const countryMap = {
      IN: 'India',
      US: 'USA',
      GB: 'UK',
    };
    
    return countryMap[data.country_code] || 'India';
  } catch (error) {
    console.error('Failed to detect country:', error);
    return 'India';
  }
};

export const generateNearbyServices = (lat, lng) => {
  // Generate random nearby services based on coordinates
  const baseServices = [
    {
      id: 1,
      name: 'Ambulance Station Alpha',
      type: 'ambulance',
      verified: true,
    },
    {
      id: 2,
      name: 'FastFix Puncture Shop',
      type: 'repair',
      verified: true,
    },
    {
      id: 3,
      name: 'TyrePro Repair Center',
      type: 'repair',
      verified: false,
    },
    {
      id: 4,
      name: 'Central Police Station',
      type: 'police',
      verified: true,
    },
    {
      id: 5,
      name: 'City General Hospital',
      type: 'hospital',
      verified: true,
    },
    {
      id: 6,
      name: 'Metro Hospital',
      type: 'hospital',
      verified: true,
    },
    {
      id: 7,
      name: 'Emergency Towing Service',
      type: 'towing',
      verified: true,
    },
    {
      id: 8,
      name: 'Rapid Ambulance Service',
      type: 'ambulance',
      verified: false,
    },
  ];

  return baseServices.map((service) => ({
    ...service,
    lat: lat + (Math.random() - 0.5) * 0.05,
    lng: lng + (Math.random() - 0.5) * 0.05,
    distance: (Math.random() * 5 + 0.5).toFixed(1),
    eta: `${Math.floor(Math.random() * 15) + 2} min`,
  }));
};
