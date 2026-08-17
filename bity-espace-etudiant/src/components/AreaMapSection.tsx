import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, X, Footprints, Bike, Car, Plus, Minus, Loader2 } from 'lucide-react';
import { Property } from '../types';

interface AreaMapSectionProps {
  property: Property;
}

interface CommuteStats {
  distance: number;
  walkingTime: number;
  cyclingTime: number;
  drivingTime: number;
}

export default function AreaMapSection({ property }: AreaMapSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const propMarkerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Coordinates determination from database or fallback to neighborhood/city
  const getPropertyCoordinates = (): [number, number] => {
    if (property.latitude && property.longitude) {
      return [property.latitude, property.longitude];
    }
    const loc = `${property.neighborhood || ''} ${property.location || ''}`.toLowerCase();
    if (loc.includes('lac 2')) return [36.8400, 10.2560];
    if (loc.includes('lac 1') || loc.includes('lac')) return [36.8325, 10.2335];
    if (loc.includes('lafayette') || loc.includes('centre ville')) return [36.8118, 10.1804];
    if (loc.includes('menzah 5') || loc.includes('el menzah 5')) return [36.8385, 10.1650];
    if (loc.includes('menzah') || loc.includes('manar')) return [36.8339, 10.1478];
    if (loc.includes('ariana soghra') || loc.includes('ghazela')) return [36.8973, 10.1895];
    if (loc.includes('ariana')) return [36.8625, 10.1956];
    if (loc.includes('marsa') || loc.includes('gammarth')) return [36.8782, 10.3247];
    if (loc.includes('carthage') || loc.includes('sidi bou said')) return [36.8528, 10.3233];
    return [36.8188, 10.1800]; // Default Tunis Centre
  };

  const propCoords = getPropertyCoordinates();

  const [commute, setCommute] = useState<CommuteStats>({
    distance: 2.4,
    walkingTime: Math.max(8, (property.distanceToUni || 10) * 2),
    cyclingTime: Math.max(4, Math.round((property.distanceToUni || 10) * 0.8)),
    drivingTime: Math.max(3, property.transportTime || 5),
  });

  // Calculate distance between two lat/lon pairs in km (Haversine)
  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: propCoords,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager tiles (clean, modern look like Mapbox)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map);

      // Custom Cyan Pin for Point A (Property)
      const propIcon = L.divIcon({
        className: 'custom-prop-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; transform: translate(-50%, -50%);">
            <div style="
              width: 32px;
              height: 32px;
              background-color: #06b6d4;
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const pMarker = L.marker(propCoords, { icon: propIcon }).addTo(map);
      propMarkerRef.current = pMarker;
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Quick suggestions for student universities / popular places in Tunisia
  const quickSuggestions = [
    { name: 'ESPRIT École d\'Ingénieurs (Ghazela)', lat: 36.8992, lon: 10.1891 },
    { name: 'Sesame University (Ghazela / Ariana)', lat: 36.8942, lon: 10.1874 },
    { name: 'INSAT Centre Urbain Nord', lat: 36.8436, lon: 10.1970 },
    { name: 'Université Paris-Dauphine Tunis', lat: 36.8423, lon: 10.2678 },
    { name: 'IHEC Carthage Présidence', lat: 36.8652, lon: 10.3340 },
    { name: 'Faculté de Médecine de Tunis (Bab Saadoun)', lat: 36.8080, lon: 10.1585 },
    { name: 'MSB / MedTech (Les Berges du Lac 2)', lat: 36.8412, lon: 10.2605 },
    { name: 'Avenue Habib Bourguiba, Centre Ville', lat: 36.8000, lon: 10.1800 },
  ];

  // Search Address or Destination
  const handlePerformSearch = async (destinationQuery: string, customLatLon?: [number, number]) => {
    if (!mapInstanceRef.current) return;
    setLoading(true);
    setShowSuggestions(false);

    try {
      let destLat = 0;
      let destLon = 0;
      let displayName = destinationQuery;

      if (customLatLon) {
        [destLat, destLon] = customLatLon;
      } else {
        // First check matched quick suggestion
        const matchedQuick = quickSuggestions.find(q => 
          q.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
          destinationQuery.toLowerCase().includes(q.name.toLowerCase())
        );

        if (matchedQuick) {
          destLat = matchedQuick.lat;
          destLon = matchedQuick.lon;
          displayName = matchedQuick.name;
        } else {
          // Geocode with Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationQuery + ', Tunisia')}&limit=1`
          );
          const data = await res.json();
          if (data && data.length > 0) {
            destLat = parseFloat(data[0].lat);
            destLon = parseFloat(data[0].lon);
            displayName = data[0].display_name;
          } else {
            // Global search fallback
            const res2 = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationQuery)}&limit=1`
            );
            const data2 = await res2.json();
            if (data2 && data2.length > 0) {
              destLat = parseFloat(data2[0].lat);
              destLon = parseFloat(data2[0].lon);
              displayName = data2[0].display_name;
            } else {
              // Simulated nearby offset point
              destLat = propCoords[0] + 0.025;
              destLon = propCoords[1] + 0.015;
            }
          }
        }
      }

      setSearchQuery(displayName);

      const map = mapInstanceRef.current;

      // Remove existing destination marker and route line
      if (destMarkerRef.current) {
        map.removeLayer(destMarkerRef.current);
      }
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }

      // Create Purple Point B Marker (as shown in image)
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background-color: #8b5cf6;
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(139, 92, 246, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 700;
            font-size: 15px;
            font-family: system-ui, sans-serif;
          ">
            B
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const dMarker = L.marker([destLat, destLon], { icon: destIcon }).addTo(map);
      destMarkerRef.current = dMarker;

      // Fetch Real Route from OSRM Routing API
      let routePoints: [number, number][] = [];
      let routeDistanceKm = 0;
      let driveDurationMin = 0;

      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${propCoords[1]},${propCoords[0]};${destLon},${destLat}?overview=full&geometries=geojson`;
        const routeRes = await fetch(osrmUrl);
        const routeData = await routeRes.json();

        if (routeData.code === 'Ok' && routeData.routes?.[0]) {
          const route = routeData.routes[0];
          routeDistanceKm = Math.round((route.distance / 1000) * 100) / 100;
          driveDurationMin = Math.max(2, Math.round(route.duration / 60));
          // Geojson coordinates are [lon, lat], Leaflet wants [lat, lon]
          routePoints = route.geometry.coordinates.map((pt: [number, number]) => [pt[1], pt[0]]);
        }
      } catch (err) {
        console.warn('OSRM routing fallback:', err);
      }

      // Fallback if OSRM unavailable
      if (routePoints.length === 0) {
        routeDistanceKm = Math.round(calculateHaversine(propCoords[0], propCoords[1], destLat, destLon) * 1.25 * 100) / 100;
        driveDurationMin = Math.max(3, Math.round((routeDistanceKm / 35) * 60) + 2);
        // Build smooth curved polyline
        const midLat = (propCoords[0] + destLat) / 2 + 0.004;
        const midLon = (propCoords[1] + destLon) / 2 - 0.003;
        routePoints = [propCoords, [midLat, midLon], [destLat, destLon]];
      }

      // Draw Navy Blue Route Line
      const routePolyline = L.polyline(routePoints, {
        color: '#1d4ed8',
        weight: 5.5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routeLayerRef.current = routePolyline;

      // Fit map bounds to show full route and both markers with comfortable padding
      const groupBounds = L.latLngBounds([propCoords, [destLat, destLon], ...routePoints]);
      map.fitBounds(groupBounds, {
        padding: [60, 60],
        maxZoom: 16,
        animate: true,
      });

      // Update commute statistics
      const walkMin = Math.max(3, Math.round((routeDistanceKm / 4.8) * 60));
      const cycleMin = Math.max(2, Math.round((routeDistanceKm / 15.0) * 60));

      setCommute({
        distance: routeDistanceKm,
        walkingTime: walkMin,
        cyclingTime: cycleMin,
        drivingTime: driveDurationMin,
      });
    } catch (e) {
      console.error('Error during address search / route calculation:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (!mapInstanceRef.current) return;

    if (destMarkerRef.current) {
      mapInstanceRef.current.removeLayer(destMarkerRef.current);
      destMarkerRef.current = null;
    }
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    mapInstanceRef.current.setView(propCoords, 14, { animate: true });

    setCommute({
      distance: 2.4,
      walkingTime: Math.max(8, (property.distanceToUni || 10) * 2),
      cyclingTime: Math.max(4, Math.round((property.distanceToUni || 10) * 0.8)),
      drivingTime: Math.max(3, property.transportTime || 5),
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handlePerformSearch(searchQuery.trim());
    }
  };

  return (
    <section className="space-y-4">
      {/* Title */}
      <h2 className="font-display text-3xl font-bold text-[#131b2e] tracking-tight">Area</h2>

      {/* Main Container Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 ambient-shadow overflow-hidden">
        {/* Map View Area */}
        <div className="relative w-full h-[380px] md:h-[430px] bg-[#e5e3df] overflow-hidden">
          {/* Leaflet Map DOM Element */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Zoom Controls (+ / -) in top right */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col bg-white rounded-lg shadow-md border border-outline-variant/20 overflow-hidden">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 hover:bg-surface-container transition-colors text-primary flex items-center justify-center border-b border-outline-variant/20 cursor-pointer"
              title="Zoom in"
              type="button"
            >
              <Plus className="w-4 h-4 text-[#45464d]" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 hover:bg-surface-container transition-colors text-primary flex items-center justify-center cursor-pointer"
              title="Zoom out"
              type="button"
            >
              <Minus className="w-4 h-4 text-[#45464d]" />
            </button>
          </div>

          {/* Map Attribution (Mapbox / OSM style) */}
          <div className="absolute bottom-2 right-2 z-[400] bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-[#45464d] shadow-sm pointer-events-none">
            © OpenStreetMap <span className="font-semibold text-primary">bity map</span>
          </div>
        </div>

        {/* Bottom Search & Commute Estimation Controls */}
        <div className="p-6 space-y-5 bg-white relative">
          {/* Search Bar Form */}
          <form ref={searchContainerRef} onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-[#76777d] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Enter an address to estimate"
                className="w-full pl-11 pr-10 py-3 bg-[#f7f9fb] border border-outline-variant/40 rounded-xl text-sm font-medium text-primary placeholder:text-[#76777d] focus:outline-none focus:border-secondary focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 p-1 rounded-full text-[#76777d] hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border-2 border-secondary text-secondary font-bold text-sm rounded-xl hover:bg-secondary hover:text-white active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Search
            </button>

            {/* Quick Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-28 mt-1 z-50 bg-white border border-outline-variant/30 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                <div className="px-3 py-2 text-[11px] font-bold text-on-surface-variant uppercase bg-[#f2f4f6] tracking-wider">
                  Campus & Universités suggérés
                </div>
                {quickSuggestions
                  .filter((s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handlePerformSearch(item.name, [item.lat, item.lon]);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-secondary/10 hover:text-secondary text-xs font-semibold text-primary flex items-center justify-between border-b border-outline-variant/10 transition-colors cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-secondary font-bold">Calculer</span>
                    </button>
                  ))}
              </div>
            )}
          </form>

          {/* Commute Modes Display Bar (Exact Match with Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 border-t border-outline-variant/15">
            {/* Walking */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-[#76777d]">Walking</span>
              <div className="flex items-center gap-2 text-sm text-[#45464d]">
                <Footprints className="w-4 h-4 text-secondary/80 shrink-0" />
                <span>
                  {commute.distance}km - <strong className="text-[#131b2e] font-bold">{commute.walkingTime} minutes</strong>
                </span>
              </div>
            </div>

            {/* Cycling */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-[#76777d]">Cycling</span>
              <div className="flex items-center gap-2 text-sm text-[#45464d]">
                <Bike className="w-4 h-4 text-secondary/80 shrink-0" />
                <span>
                  {Math.round(commute.distance * 1.02 * 100) / 100}km - <strong className="text-[#131b2e] font-bold">{commute.cyclingTime} minutes</strong>
                </span>
              </div>
            </div>

            {/* Driving */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-[#76777d]">Driving</span>
              <div className="flex items-center gap-2 text-sm text-[#45464d]">
                <Car className="w-4 h-4 text-secondary/80 shrink-0" />
                <span>
                  {Math.round(commute.distance * 1.15 * 100) / 100}km - <strong className="text-[#131b2e] font-bold">{commute.drivingTime} minutes</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
