import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, Briefcase, Mail, Phone, User, ChevronDown, Languages, Star } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Ensure Map is imported correctly from leaflet
import L, { Map } from 'leaflet';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Lawyer {
  id: number;
  name: string;
  state: string;
  district: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  rating: number;
  languages: string[];
  lat: number;
  lng: number;
}

// State coordinates for map markers
const stateCoordinates: Record<string, { lat: number; lng: number }> = {
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
  "Assam": { lat: 26.2006, lng: 92.9376 },
  "Bihar": { lat: 25.0961, lng: 85.3131 },
  "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Gujarat": { lat: 22.2587, lng: 71.1924 },
  "Haryana": { lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  "Jharkhand": { lat: 23.6102, lng: 85.2799 },
  "Karnataka": { lat: 15.3173, lng: 75.7139 },
  "Kerala": { lat: 10.8505, lng: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  "Maharashtra": { lat: 19.7515, lng: 75.7139 },
  "Manipur": { lat: 24.6637, lng: 93.9063 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662 },
  "Mizoram": { lat: 23.1645, lng: 92.9376 },
  "Nagaland": { lat: 26.1584, lng: 94.5624 },
  "Odisha": { lat: 20.9517, lng: 85.0985 },
  "Punjab": { lat: 31.1471, lng: 75.3412 },
  "Rajasthan": { lat: 27.0238, lng: 74.2179 },
  "Sikkim": { lat: 27.5330, lng: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  "Telangana": { lat: 18.1124, lng: 79.0193 },
  "Tripura": { lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "West Bengal": { lat: 22.9868, lng: 87.8550 },
  "Andaman and Nicobar Islands": { lat: 11.7401, lng: 92.6586 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Dadra and Nagar Haveli and Daman and Diu": { lat: 20.1809, lng: 73.0169 },
  "Lakshadweep": { lat: 10.5667, lng: 72.6417 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Puducherry": { lat: 11.9416, lng: 79.8083 }
};

// Component to handle map centering and marker highlighting
const MapController = ({
  center,
  zoom,
  selectedLawyer,
  onResetView
}: {
  center: [number, number];
  zoom: number;
  selectedLawyer: Lawyer | null;
  onResetView: () => void;
}) => {
  const map = useMap();
  const prevSelectedRef = useRef<Lawyer | null>(null);

  useEffect(() => {
    // Clear previous highlight regardless of current selection
    if (prevSelectedRef.current) {
        // Attempt to find marker by title - make sure Marker component has a `title` prop
        const prevMarkerEl = document.querySelector(
          `.leaflet-marker-icon[title="${prevSelectedRef.current.name}"]`
        );
        prevMarkerEl?.classList.remove('selected-marker');
    }

    if (selectedLawyer) {
      // Smooth fly to the selected lawyer
      map.flyTo([selectedLawyer.lat, selectedLawyer.lng], 14, {
        duration: 1,
        easeLinearity: 0.25
      });

      // Add highlight to current marker after a slight delay to ensure it exists
      setTimeout(() => {
          const currentMarkerEl = document.querySelector(
            `.leaflet-marker-icon[title="${selectedLawyer.name}"]`
          );
          currentMarkerEl?.classList.add('selected-marker');
      }, 100); // Delay might need adjustment

      prevSelectedRef.current = selectedLawyer;
    } else {
      // If no lawyer is selected, fly back to the default view (center based on filters)
      map.flyTo(center, zoom, {
        duration: 1,
        easeLinearity: 0.25
      });
      prevSelectedRef.current = null; // Clear the ref when resetting
    }
    // Note: Map instance itself shouldn't be a dependency here to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLawyer, center, zoom]);

  return (
    <div className="leaflet-top leaflet-right z-[1000]"> {/* Ensure button is clickable */}
      <div className="leaflet-control leaflet-bar bg-white shadow rounded">
        <button
          onClick={onResetView}
          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          title="Reset view"
          aria-label="Reset map view"
        >
          {/* Simple Reset Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const LawyerDirectory = () => {
  // State management
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    specialization: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [contactingLawyer, setContactingLawyer] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  // Use the Map type from leaflet for the ref
  const mapRef = useRef<Map | null>(null);

  // All Indian states and union territories
  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry"
  ];

  // Districts for each state (sample data)
  const stateDistricts: Record<string, string[]> = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Raigarh"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar"],
    "Himachal Pradesh": ["Shimla", "Kullu", "Mandi", "Solan", "Kangra"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Ukhrul", "Churachandpur"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Soreng"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar", "Mayabunder", "Rangat", "Diglipur"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Kadmat"],
    "Delhi": ["New Delhi", "Central Delhi", "East Delhi", "North Delhi", "South Delhi"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
  };

  const specializations = ["Criminal", "Civil", "Corporate", "Family", "Tax", "Property", "Labour", "Cyber", "Constitutional", "Environmental"];
  const languages = ["Hindi", "English", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi", "Malayalam", "Kannada"];

  // Generate sample lawyer data
  const lawyers = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const state = indianStates[i % indianStates.length];
      const districts = stateDistricts[state as keyof typeof stateDistricts] || [state]; // Fallback if districts are missing
      const district = districts[i % districts.length];
      const stateCoord = stateCoordinates[state] || { lat: 20.5937, lng: 78.9629 }; // Default coord if state missing

      // Add random variation to coordinates
      const lat = stateCoord.lat + (Math.random() - 0.5) * 0.5; // Reduced variation
      const lng = stateCoord.lng + (Math.random() - 0.5) * 0.5; // Reduced variation

      return {
        id: i + 1,
        name: `Adv. ${["Raj", "Priya", "Amit", "Neha", "Vikram", "Ananya", "Rahul", "Deepak", "Sunita", "Arjun"][i % 10]} ${["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Naidu", "Nair", "Menon", "Chatterjee"][i % 10]}`,
        state,
        district,
        specialization: specializations[i % specializations.length],
        email: `lawyer${i + 1}@example.com`,
        phone: `+91 ${9000000000 + i}`,
        experience: 5 + (i % 20),
        rating: Math.max(3.0, Math.min(5.0, 3.5 + (i % 15) / 10)), // Ensure rating is between 3.0 and 5.0
        languages: Array.from(new Set([languages[i % 3], languages[(i + 1) % 5], languages[(i + 2) % 7]])), // Ensure unique languages
        lat,
        lng
      };
    });
  }, []);

  // Filter lawyers
  const filteredLawyers = useMemo(() => {
    return lawyers.filter(lawyer => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === "" ||
        lawyer.name.toLowerCase().includes(searchLower) ||
        lawyer.specialization.toLowerCase().includes(searchLower) ||
        lawyer.district.toLowerCase().includes(searchLower) ||
        lawyer.state.toLowerCase().includes(searchLower);

      const matchesFilters =
        (filters.state === "" || lawyer.state === filters.state) &&
        (filters.district === "" || lawyer.district === filters.district) &&
        (filters.specialization === "" || lawyer.specialization === filters.specialization);

      return matchesSearch && matchesFilters;
    });
  }, [lawyers, searchQuery, filters]);

  // Calculate map center and default zoom based on filtered lawyers
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India approx.
  const defaultZoom = 5;

  const mapConfig = useMemo(() => {
    if (!filteredLawyers.length) {
        // No lawyers match, show default view
        return { center: defaultCenter, zoom: defaultZoom };
    }
    if (filteredLawyers.length === 1) {
        // Only one lawyer, center on them and zoom in
        return { center: [filteredLawyers[0].lat, filteredLawyers[0].lng] as [number, number], zoom: 12 };
    }

    // Multiple lawyers, calculate average position for center
    const avgLat = filteredLawyers.reduce((sum, l) => sum + l.lat, 0) / filteredLawyers.length;
    const avgLng = filteredLawyers.reduce((sum, l) => sum + l.lng, 0) / filteredLawyers.length;

    // Calculate bounds to determine appropriate zoom
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    filteredLawyers.forEach(l => {
        minLat = Math.min(minLat, l.lat);
        maxLat = Math.max(maxLat, l.lat);
        minLng = Math.min(minLng, l.lng);
        maxLng = Math.max(maxLng, l.lng);
    });

    // Determine zoom based on bounds (simplified approach)
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    let zoom = defaultZoom;
    if (maxDiff < 0.1) zoom = 13;      // Very close
    else if (maxDiff < 0.5) zoom = 11; // Nearby city/area
    else if (maxDiff < 2) zoom = 9;    // Regional
    else if (maxDiff < 5) zoom = 7;    // State level
    else if (maxDiff < 15) zoom = 6;   // Multi-state
    // else defaultZoom (5) for very wide spread

    return { center: [avgLat, avgLng] as [number, number], zoom: zoom };

  }, [filteredLawyers]);


  // Handle view on map
  const handleViewOnMap = (lawyer: Lawyer) => {
    setShowMap(true);
    setSelectedLawyer(lawyer); // Set selected lawyer first

    // Scroll to map after a slight delay
    setTimeout(() => {
      const mapElement = document.getElementById('lawyer-map');
      mapElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 150);
  };

  // Reset map view and lawyer selection
  const handleResetView = () => {
    setSelectedLawyer(null);
    // Fly map back to the center/zoom based on current filters
    if(mapRef.current) {
        mapRef.current.flyTo(mapConfig.center, mapConfig.zoom);
    }
  };

  // Send message to lawyer (placeholder)
  const handleSendMessage = (lawyerId: number) => {
    if (!messageContent.trim()) return;
    console.log(`Simulating sending message to lawyer ${lawyerId}: ${messageContent}`);
    alert(`Message sent to lawyer ${lawyerId}: "${messageContent}"`);
    setMessageContent("");
    setContactingLawyer(null);
  };

  // Add CSS for selected marker highlight effect
  useEffect(() => {
    const styleId = 'selected-marker-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .selected-marker {
          filter: brightness(1.1) hue-rotate(280deg) saturate(2.5); /* Example purple highlight */
          transform: scale(1.2);
          transform-origin: bottom;
          z-index: 1000 !important; /* Ensure it's on top */
          transition: transform 0.2s ease-out, filter 0.2s ease-out;
        }
        .leaflet-marker-icon:not(.selected-marker) {
          transition: transform 0.2s ease-out, filter 0.2s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
    // No cleanup needed if style should persist for component lifetime
  }, []);


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Find a Lawyer in India</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Connect with qualified legal professionals across all states and UTs</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto md:min-w-[300px] lg:min-w-[400px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, specialization, location..."
            className="pl-10 w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for lawyers"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* State Filter */}
          <div className="relative">
            <label htmlFor="state-filter" className="sr-only">State</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="state-filter"
              name="state"
              value={filters.state}
              onChange={(e) => setFilters({...filters, state: e.target.value, district: ""})} // Reset district on state change
              className="pl-10 w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none transition-all cursor-pointer bg-white"
            >
              <option value="">All States/UTs</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* District Filter */}
          <div className="relative">
             <label htmlFor="district-filter" className="sr-only">District</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="district-filter"
              name="district"
              value={filters.district}
              onChange={(e) => setFilters({...filters, district: e.target.value})}
              className="pl-10 w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none transition-all cursor-pointer bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!filters.state || !stateDistricts[filters.state]?.length}
              aria-disabled={!filters.state || !stateDistricts[filters.state]?.length}
            >
              <option value="">All Districts</option>
              {filters.state && stateDistricts[filters.state as keyof typeof stateDistricts]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Specialization Filter */}
          <div className="relative">
             <label htmlFor="specialization-filter" className="sr-only">Specialization</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="specialization-filter"
              name="specialization"
              value={filters.specialization}
              onChange={(e) => setFilters({...filters, specialization: e.target.value})}
              className="pl-10 w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none transition-all cursor-pointer bg-white"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec} Law</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

       {/* Map Toggle & Result Count */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm active:scale-[0.98]"
          aria-pressed={showMap}
        >
          <MapPin className="h-5 w-5 mr-2" />
          {showMap ? "Hide Map" : "Show Map"}
        </button>
        <p className="text-gray-600 text-sm md:text-base" aria-live="polite">
          Showing {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Interactive Map */}
      {showMap && (
        <div id="lawyer-map" className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200">
          <div className="h-[400px] md:h-[500px] w-full relative">
            {/* Use key to force remount/reset if center/zoom fundamentally change (e.g., filters change drastically) */}
            {/* Ensure mapConfig values are stable during selection changes to avoid unnecessary remounts */}
            <MapContainer
              key={`${mapConfig.center.join(',')}-${mapConfig.zoom}`}
              center={mapConfig.center}
              zoom={mapConfig.zoom}
              style={{ height: '100%', width: '100%' }}
              // *** FIX APPLIED HERE: Explicitly type mapInstance with the imported Map type ***
              whenReady={(mapInstance: Map) => { mapRef.current = mapInstance; }}
              scrollWheelZoom={true} // Enable scroll wheel zoom
              className="z-0" // Ensure map is below controls like MapController
            >
              <MapController
                center={mapConfig.center} // Pass the calculated center/zoom
                zoom={mapConfig.zoom}
                selectedLawyer={selectedLawyer}
                onResetView={handleResetView}
              />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredLawyers.map(lawyer => (
                <Marker
                  key={lawyer.id}
                  position={[lawyer.lat, lawyer.lng]}
                  // Add title attribute for easier selection in MapController
                  title={lawyer.name}
                  eventHandlers={{
                    click: () => {
                      setSelectedLawyer(lawyer);
                    }
                  }}
                >
                  <Popup>
                    <div className="max-w-xs text-sm">
                      <h3 className="font-bold text-base mb-1">{lawyer.name}</h3>
                      <p className="text-gray-700 flex items-center mb-1">
                        <Briefcase className="inline h-4 w-4 mr-1 flex-shrink-0" />
                        {lawyer.specialization} Law
                      </p>
                      <p className="text-gray-700 flex items-center">
                        <MapPin className="inline h-4 w-4 mr-1 flex-shrink-0" />
                        {lawyer.district}, {lawyer.state}
                      </p>
                      <button
                        onClick={() => setContactingLawyer(lawyer.id)}
                        className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Contact Lawyer
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Lawyers List */}
      {filteredLawyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map(lawyer => (
            <div key={lawyer.id} className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border ${selectedLawyer?.id === lawyer.id ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="p-5 md:p-6">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-grow min-w-0"> {/* Ensure text wraps */}
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-tight truncate" title={lawyer.name}>{lawyer.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <Briefcase className="inline h-4 w-4 mr-1.5 flex-shrink-0" />
                      {lawyer.specialization} Law
                    </p>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin className="inline h-4 w-4 mr-1.5 flex-shrink-0" />
                      {lawyer.district}, {lawyer.state}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center border-t border-b border-gray-100 py-3 my-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Experience</p>
                    <p className="font-medium text-sm mt-0.5">{lawyer.experience} yrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Rating</p>
                    <div className="flex items-center justify-center mt-0.5">
                      <span className="font-medium mr-1 text-sm">{lawyer.rating.toFixed(1)}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Contact</p>
                    <div className="flex space-x-2 justify-center mt-1">
                      <a href={`mailto:${lawyer.email}`} className="text-gray-500 hover:text-blue-600 transition-colors" title={`Email ${lawyer.name}`}>
                        <Mail className="h-5 w-5" />
                      </a>
                      <a href={`tel:${lawyer.phone}`} className="text-gray-500 hover:text-blue-600 transition-colors" title={`Call ${lawyer.name}`}>
                        <Phone className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 flex items-center mb-1 uppercase tracking-wider">
                    <Languages className="h-4 w-4 mr-1.5" />
                    Languages
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lawyer.languages.map(lang => (
                      <span key={lang} className="px-2.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleViewOnMap(lawyer)}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center font-medium text-gray-700 active:scale-[0.98]"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </button>
                  <button
                    onClick={() => setContactingLawyer(lawyer.id)}
                    className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium active:scale-[0.98]"
                  >
                    Contact Lawyer
                  </button>
                </div>

                {contactingLawyer === lawyer.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Send a message:</h4>
                    <textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type your inquiry here..."
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-2"
                      rows={3}
                      aria-label={`Message to ${lawyer.name}`}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setContactingLawyer(null)}
                        className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendMessage(lawyer.id)}
                        disabled={!messageContent.trim()}
                        className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200 col-span-1 md:col-span-2 lg:col-span-3">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-800">No lawyers found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search query or filters.
            </p>
          </div>
      )}
    </div>
  );
};

export default LawyerDirectory;