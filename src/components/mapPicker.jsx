import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { FaLocationArrow, FaMapMarkerAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Create custom red marker icon
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DC2626" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const MapPicker = ({ onSelect, onClose }) => {
  const [position, setPosition] = useState({ lat: 27.7172, lng: 85.3240 });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (position) {
      const fetchAddress = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
          );
          const data = await res.json();
          setAddress(data.display_name || 'Unknown location');
        } catch (err) {
          console.error('Error fetching address:', err);
          setAddress('Error getting address');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAddress();
    }
  }, [position]);

  const handleConfirm = () => {
    if (onSelect && address && address !== 'Unknown location') {
      onSelect(address);
    } else {
      alert("Please select a valid location on the map.");
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=1&countrycodes=np`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setAddress(display_name);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (err) {
      console.error('Error searching location:', err);
      alert('Error searching location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Could not get your current location. Please enable location services.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 text-xl mr-3" />
                <div>
                  <h2 className="text-lg font-bold">Select Location</h2>
                  <p className="text-gray-300 text-xs">Click on the map or search for a location</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search for places in Nepal..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchTerm.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                ) : (
                  'Search'
                )}
              </button>
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                title="Use current location"
              >
                <FaLocationArrow className="text-sm" />
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="p-4">
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                key={`${position.lat}-${position.lng}`}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker setPosition={setPosition} />
                <Marker position={position} icon={customIcon}></Marker>
              </MapContainer>
            </div>

            {/* Address Display */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-600 mt-1 mr-2 flex-shrink-0 text-sm" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm">Selected Location</h4>
                  {isLoading ? (
                    <div className="flex items-center text-gray-500">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-600 border-t-transparent mr-2"></div>
                      <span className="text-xs">Getting address...</span>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {address || "Click on the map to select a location"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!address || address === 'Unknown location' || address === 'Error getting address'}
              className="px-4 py-2 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none text-sm"
            >
              Confirm Location
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MapPicker;
