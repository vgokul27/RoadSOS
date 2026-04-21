import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Hospital,
  Shield,
  Ambulance,
  Wrench,
  BadgeCheck,
  Phone,
  Globe,
  Clock,
  AlertCircle,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import MapView from '../components/MapView';
import { cacheLocation, getCachedLocation, cacheServices, getCachedServices, cacheCountry, getCachedCountry } from '../lib/offlineStorage';
import { getCountryByCode, detectCountryByIP, generateNearbyServices } from '../lib/emergencyNumbers';
import { useOnlineStatus } from '../lib/useOnlineStatus';

export default function EmergencyMap() {
  const [filter, setFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [country, setCountry] = useState(getCachedCountry());
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const isOnline = useOnlineStatus();

  const countryInfo = getCountryByCode(country);

  // Detect country on mount or when online status changes
  useEffect(() => {
    if (isOnline) {
      detectCountryByIP().then((code) => {
        setCountry(code);
        cacheCountry(code);
      });
    }
  }, [isOnline]);

  // Get user location and nearby services
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          const svc = generateNearbyServices(loc.lat, loc.lng);
          setServices(svc);
          cacheLocation(loc);
          cacheServices(svc);
          setLoading(false);
        },
        () => {
          // Fallback: use cached or default location
          const cached = getCachedLocation();
          const fallback = cached ? {
            lat: cached.lat,
            lng: cached.lng,
          } : { lat: 28.6139, lng: 77.209 };
          
          setLocation(fallback);
          const svc = isOnline 
            ? generateNearbyServices(fallback.lat, fallback.lng) 
            : getCachedServices();
          setServices(svc.length ? svc : generateNearbyServices(fallback.lat, fallback.lng));
          setLoading(false);
        }
      );
    } else {
      const cached = getCachedLocation();
      const fallback = cached ? {
        lat: cached.lat,
        lng: cached.lng,
      } : { lat: 28.6139, lng: 77.209 };
      setLocation(fallback);
      setServices(getCachedServices().length ? getCachedServices() : generateNearbyServices(fallback.lat, fallback.lng));
      setLoading(false);
    }
  }, [isOnline]);

  // Handle SOS emergency alert
  const handleSOS = async () => {
    if (!location) return;

    setSosActive(true);
    setSosMessage('🚨 SOS ACTIVATED - Emergency services notified');

    // Simulate sending location and alerts
    const nearestAmbulance = services.find((s) => s.type === 'ambulance');
    const nearestPolice = services.find((s) => s.type === 'police');

    if (nearestAmbulance) {
      console.log('📍 Ambulance notified:', nearestAmbulance.name);
    }
    if (nearestPolice) {
      console.log('🚔 Police notified:', nearestPolice.name);
    }

    // Auto-call emergency number
    const emergencyNumber = countryInfo.emergencyNumber;
    console.log(`📞 Initiating call to ${emergencyNumber}`);

    // Show success message and reset after 3 seconds
    setTimeout(() => {
      setSosActive(false);
      setSosMessage('');
    }, 3000);
  };

  const filteredServices =
    filter === 'all'
      ? services
      : services.filter((s) => s.type === filter);

  // Emergency numbers for different countries
  const emergencyNumbers = {
    India: {
      emergency: '112',
      police: '100',
      ambulance: '108',
    },
    USA: {
      emergency: '911',
      police: '911',
      ambulance: '911',
    },
    UK: {
      emergency: '999',
      police: '999',
      ambulance: '999',
    },
  };

  const typeIcons = {
    hospital: Hospital,
    police: Shield,
    ambulance: Ambulance,
    towing: Navigation,
    repair: Wrench,
  };

  const typeColors = {
    hospital: 'hsl(145 65% 42%)',
    police: 'hsl(195 100% 50%)',
    ambulance: 'hsl(45 95% 55%)',
    towing: 'hsl(280 85% 65%)',
    repair: 'hsl(45 95% 55%)',
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'hospital', label: 'Hospitals' },
    { key: 'ambulance', label: 'Ambulance' },
    { key: 'police', label: 'Police' },
    { key: 'towing', label: 'Towing' },
    { key: 'repair', label: 'Repair' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-10"
      style={{
        background:
          'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)',
      }}
    >
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(0 85% 55% / 0.2)' }}
              >
                <MapPin className="w-6 h-6" style={{ color: 'hsl(0 85% 55%)' }} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Emergency Map</h1>
                <p className="text-gray-400 text-sm">
                  Find nearest emergency & vehicle services
                </p>
              </div>
            </div>
            {/* Country Selector */}
            <motion.select
              whileHover={{ scale: 1.05 }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-3 rounded-lg font-medium text-white"
              style={{
                background: 'hsl(220 13% 10% / 0.8)',
                borderColor: 'hsl(0 85% 55% / 0.3)',
                borderWidth: '1px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <option value="India">India (112)</option>
              <option value="USA">USA (911)</option>
              <option value="UK">UK (999)</option>
            </motion.select>
          </div>

          {/* Emergency Numbers */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border flex flex-wrap items-center gap-4"
            style={{
              borderColor: 'hsl(0 85% 55% / 0.3)',
              backgroundColor: 'hsl(220 13% 10% / 0.6)',
              backdropFilter: 'blur(8px)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-5 h-5" style={{ color: 'hsl(150 80% 50%)' }} />
              <span className="text-gray-400">{country} Emergency Numbers:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: 'Emergency',
                  num: emergencyNumbers[country].emergency,
                  color: 'hsl(0 85% 55%)',
                },
                {
                  label: 'Police',
                  num: emergencyNumbers[country].police,
                  color: 'hsl(195 100% 50%)',
                },
                {
                  label: 'Ambulance',
                  num: emergencyNumbers[country].ambulance,
                  color: 'hsl(45 95% 55%)',
                },
              ].map((n) => (
                <motion.a
                  key={n.label}
                  href={`tel:${n.num}`}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    color: n.color,
                    background: n.color.replace(')', ' / 0.15)'),
                    borderColor: n.color.replace(')', ' / 0.4)'),
                    borderWidth: '1px',
                  }}
                >
                  <Phone className="w-4 h-4" />
                  {n.label}: {n.num}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-8 flex-wrap">
          {filterOptions.map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setFilter(f.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all border`}
              style={{
                background:
                  filter === f.key
                    ? 'hsl(0 85% 55% / 0.2)'
                    : 'hsl(220 13% 10% / 0.6)',
                borderColor:
                  filter === f.key
                    ? 'hsl(0 85% 55% / 0.5)'
                    : 'hsl(0 85% 55% / 0.2)',
                color:
                  filter === f.key ? 'hsl(0 85% 55%)' : 'white',
                backdropFilter: 'blur(8px)',
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 p-8 rounded-2xl border relative"
            style={{
              borderColor: 'hsl(0 85% 55% / 0.3)',
              backgroundColor: 'hsl(220 13% 10% / 0.6)',
              backdropFilter: 'blur(8px)',
              boxShadow: 'var(--shadow-card)',
              minHeight: '500px',
            }}
          >
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin mb-4">
                    <MapPin className="w-12 h-12 text-red-500 mx-auto" />
                  </div>
                  <p className="text-gray-300">Detecting location...</p>
                </div>
              </div>
            ) : location ? (
              <MapView
                userLocation={location}
                services={filteredServices}
                filter={filter}
                selectedService={selectedService}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center">
                <p className="text-gray-400">Unable to get location</p>
              </div>
            )}

            {/* Offline Indicator */}
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  background: 'hsl(45 95% 55% / 0.2)',
                  borderColor: 'hsl(45 95% 55% / 0.5)',
                  borderWidth: '1px',
                }}
              >
                <WifiOff className="w-4 h-4" style={{ color: 'hsl(45 95% 55%)' }} />
                <span className="text-sm font-medium" style={{ color: 'hsl(45 95% 55%)' }}>
                  Offline Mode
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar with SOS and Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* SOS Button */}
            <motion.button
              onClick={handleSOS}
              disabled={sosActive}
              whileHover={!sosActive ? { scale: 1.05 } : {}}
              whileTap={!sosActive ? { scale: 0.95 } : {}}
              className="w-full py-6 rounded-2xl font-bold text-white text-lg transition-all border-2 relative overflow-hidden"
              style={{
                background: sosActive ? 'hsl(0 85% 55%)' : 'var(--gradient-emergency)',
                borderColor: 'hsl(0 85% 55%)',
                boxShadow: sosActive
                  ? '0 0 40px hsl(0 85% 55% / 0.6)'
                  : 'var(--shadow-emergency)',
              }}
            >
              {sosActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute inset-0"
                  style={{
                    background: 'hsl(0 85% 55% / 0.3)',
                    borderRadius: '1rem',
                  }}
                />
              )}
              <div className="relative flex items-center justify-center gap-2">
                <AlertCircle className="w-6 h-6" />
                SOS EMERGENCY
              </div>
            </motion.button>

            {/* SOS Status Message */}
            {sosMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-center font-semibold text-white"
                style={{
                  background: 'hsl(0 85% 55% / 0.2)',
                  borderColor: 'hsl(0 85% 55% / 0.5)',
                  borderWidth: '1px',
                  color: 'hsl(0 85% 55%)',
                }}
              >
                {sosMessage}
              </motion.div>
            )}

            {/* Location Info */}
            {location && (
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl text-sm"
                style={{
                  background: 'hsl(220 13% 10% / 0.6)',
                  borderColor: 'hsl(0 85% 55% / 0.3)',
                  borderWidth: '1px',
                }}
              >
                <p className="text-gray-400 mb-1">📍 Your Location</p>
                <p className="text-white font-mono text-xs">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </motion.div>
            )}

            <h2 className="text-xl font-bold text-white">
              Nearby Services ({filteredServices.length})
            </h2>
            <div
              className="space-y-2 max-h-[460px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'hsl(0 85% 55% / 0.3) transparent',
              }}
            >
              {filteredServices.map((service, idx) => {
                const Icon = typeIcons[service.type];
                const isSelected = selectedService?.id === service.id;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() =>
                      setSelectedService(
                        isSelected ? null : service
                      )
                    }
                    className="p-4 rounded-xl border cursor-pointer transition-all"
                    style={{
                      borderColor: isSelected
                        ? 'hsl(0 85% 55% / 0.5)'
                        : 'hsl(0 85% 55% / 0.2)',
                      backgroundColor: isSelected
                        ? 'hsl(0 85% 55% / 0.1)'
                        : 'hsl(220 13% 10% / 0.6)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: isSelected
                        ? '0 0 20px hsl(0 85% 55% / 0.2)'
                        : 'var(--shadow-card)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0"
                        style={{ color: typeColors[service.type] }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white truncate">
                            {service.name}
                          </p>
                          {service.verified && (
                            <BadgeCheck className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(145 65% 42%)' }} />
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {service.distance} km
                          </span>
                          <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'hsl(45 95% 55%)' }}>
                            ETA: {service.eta}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
