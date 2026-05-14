import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vehicle } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation2, Users, AlertTriangle, Crosshair, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { OperationType, handleFirestoreError } from '../lib/firebase';
import { navState } from '../lib/navState';
import { useRealWeather } from '../lib/weather';

// User marker icon
const userIcon = L.divIcon({
  className: 'user-marker',
  html: '<div class="w-5 h-5 bg-amber-400 rounded-full border-2 border-[#070914] shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Helper to keep map centered gracefully when a vehicle is followed
function FollowCam({ target, userPos }: { target: Vehicle | null, userPos: { lat: number, lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [target, map]);
  
  return null;
}

// Markers
const createVehicleIcon = (type: string, isdelayed: boolean, heading: number) => {
  const color = type === 'bus' ? '#2563eb' : '#06b6d4'; // blue or cyan
  const bgStr = isdelayed ? 'rgba(239, 68, 68, 0.2)' : `rgba(37, 99, 235, 0.15)`;
  const glowStr = isdelayed ? '0 8px 24px rgba(239,68,68,0.4)' : `0 8px 24px rgba(37,99,235,0.3)`;
  const borderCol = isdelayed ? '#ef4444' : color;
  
  return L.divIcon({
    className: 'custom-vehicle-marker transition-all duration-[3000ms] ease-linear',
    html: `
      <div style="
        width: 36px; 
        height: 36px; 
        background: ${bgStr}; 
        border-radius: 50%;
        border: 2px solid ${borderCol};
        box-shadow: ${glowStr};
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        transform: rotate(${heading}deg);
        transition: transform 1s ease-in-out;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

export function LiveMapScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(navState.getSelectedVehicleId());
  const [userPos, setUserPos] = useState<{ lat: number, lng: number } | null>(null);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  useEffect(() => {
    return navState.subscribe(() => {
      setSelectedVehicleId(navState.getSelectedVehicleId());
    });
  }, []);

  const handleSetSelectedVehicleId = (id: string | null) => {
    navState.setSelectedVehicleId(id);
  };

  useEffect(() => {
    // Listen to real-time vehicles
    const q = query(collection(db, 'vehicles'), where('type', 'in', ['bus', 'ferry']));
    const unsub = onSnapshot(q, (snap) => {
      const vData: Vehicle[] = [];
      snap.forEach(doc => {
        const v = { id: doc.id, ...doc.data() } as Vehicle;
        // ONLY show real documented driver trips. Ignore mock or placeholder entries.
        if (v.status !== 'inactive' && v.driverId) {
          vData.push(v);
        }
      });
      setVehicles(vData);
    }, (error) => {
       handleFirestoreError(error, OperationType.LIST, 'vehicles');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("Location error:", err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (userPos && mapRef) {
      mapRef.flyTo([userPos.lat, userPos.lng], 16);
    }
  }, [userPos, mapRef]);

  const nearbyVehicles = vehicles.filter(v => {
    if (v.lat === 0 && v.lng === 0) return true; // Include vehicles waiting for GPS lock
    return true; 
  });

  const selectedVehicle = nearbyVehicles.find(v => v.id === selectedVehicleId) || null;
  const weather = useRealWeather();
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  useEffect(() => {
    if (mapRef && selectedVehicle && vehicles.length > 0) {
      mapRef.flyTo([selectedVehicle.lat, selectedVehicle.lng], 15, { animate: true, duration: 1.5 });
    }
  }, [mapRef, selectedVehicleId]); 

  return (
    <div className="w-full h-full relative bg-slate-50 flex flex-col font-sans">
      <AnimatePresence>
        {weather.alert && !isAlertDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -50, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -50, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-full bg-red-950/80 border-b border-red-500/30 overflow-hidden z-[1000] shadow-[0_8px_20px_rgba(149,157,165,0.1)] backdrop-blur-3xl"
          >
            <div className="flex items-start gap-3 p-5 pt-8 max-w-7xl mx-auto backdrop-blur-3xl">
              <div className="mt-0.5 max-w-fit rounded-full bg-red-500/20 p-2 border border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">System Alert</h4>
                <p className="text-sm text-red-200 mt-1 leading-relaxed opacity-90">{weather.alert}</p>
              </div>
              <button 
                onClick={() => setIsAlertDismissed(true)}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-slate-900 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 relative">
        <MapContainer 
          center={[9.9816, 76.2999]} 
          zoom={14} 
          zoomControl={false}
          className="w-full h-full"
          attributionControl={false}
          ref={setMapRef}
        >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {nearbyVehicles.map(v => (
          <Marker 
            key={v.id} 
            position={[v.lat, v.lng]} 
            icon={createVehicleIcon(v.type, v.status === 'delayed', v.heading)}
            eventHandlers={{
              click: () => handleSetSelectedVehicleId(v.id)
            }}
            zIndexOffset={v.id === selectedVehicleId ? 1000 : 0}
          />
        ))}

        {/* Vehicle Trails */}
        {nearbyVehicles.filter(v => v.path && v.path.length > 1).map((v) => (
          <Polyline
            key={`path-${v.id}`}
            positions={v.path!.map(p => [p.lat, p.lng] as [number, number])}
            color={v.type === 'bus' ? '#2563eb' : '#06b6d4'}
            weight={v.id === selectedVehicleId ? 5 : 3}
            opacity={v.id === selectedVehicleId ? 0.8 : 0.4}
            dashArray={v.id === selectedVehicleId ? undefined : "5, 10"}
          />
        ))}

        {userPos && (
          <>
            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} zIndexOffset={500} />
            <Circle 
              center={[userPos.lat, userPos.lng]} 
              radius={100} 
              pathOptions={{ fillColor: '#fbbf24', fillOpacity: 0.1, stroke: false }} 
            />
          </>
        )}

        <FollowCam target={selectedVehicle} userPos={userPos} />
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[400] flex flex-col gap-3 sm:gap-4">
        <button 
          onClick={handleLocate}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-[40px] border border-white/60 rounded-[16px] sm:rounded-[20px] shadow-[0_12px_32px_-12px_rgba(37,99,235,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center text-brand-blue transition-all active:scale-95 hover:scale-105 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Crosshair className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        </button>
      </div>

      {/* Floating Header */}
      <div className="absolute top-12 left-4 right-4 z-[400] pointer-events-none flex justify-center">
         <motion.div 
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-white/80 backdrop-blur-[40px] border border-white/60 px-6 py-3.5 rounded-full pointer-events-auto shadow-[0_16px_40px_-12px_rgba(37,99,235,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center gap-3 relative overflow-hidden"
         >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 to-brand-sky/5 pointer-events-none"></div>
            <div className="flex h-2.5 w-2.5 relative z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blue"></span>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-slate-800 relative z-10">Live Operations</span>
         </motion.div>
      </div>

      {/* Cinematic Bottom Sheet for Selected Vehicle */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-[90px] left-4 right-4 z-[1000]"
          >
            <div className="bg-white/90 backdrop-blur-[40px] rounded-[32px] sm:rounded-[36px] p-4 sm:p-6 border border-white/80 shadow-[0_-16px_40px_-12px_rgba(37,99,235,0.15),inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full mix-blend-multiply pointer-events-none" />
               
               {/* Drag Handle */}
               <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-4 sm:mb-6"></div>
               
               <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
                 <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-2">
                     <span className={cn(
                       "px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest border",
                       selectedVehicle.type === 'bus' ? "bg-brand-blue/20 text-brand-blue border-brand-blue/30" : "bg-brand-blue/20 text-brand-blue border-brand-blue/30"
                     )}>
                       {selectedVehicle.routeNumber}
                     </span>
                     {selectedVehicle.status === 'delayed' && (
                        <span className="px-2 sm:px-3 py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Delayed
                        </span>
                     )}
                   </div>
                   <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">{selectedVehicle.routeName}</h2>
                 </div>
                 
                 <div className="text-right shrink-0 flex flex-col justify-center items-end">
                   {selectedVehicle.speed > 2 ? (
                     <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600">
                       {Math.round(selectedVehicle.speed)}<span className="text-lg sm:text-xl text-slate-500 ml-1 tracking-normal font-sans">km/h</span>
                     </div>
                   ) : (
                     <div className="text-xl sm:text-2xl font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                       Stopped
                     </div>
                   )}
                 </div>
               </div>

               {/* Metrics Grid */}
               <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
                 <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 border border-slate-100 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-3">
                       <Users className="w-3 h-3 sm:w-4 sm:h-4 text-brand-blue" /> Crowd
                    </div>
                    <div className="font-bold capitalize text-lg sm:text-xl flex items-center gap-2 text-slate-900">
                       {selectedVehicle.crowdLevel === 'empty' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                       {selectedVehicle.crowdLevel === 'moderate' && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
                       {(selectedVehicle.crowdLevel === 'crowded' || selectedVehicle.crowdLevel === 'full') && <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                       {selectedVehicle.crowdLevel}
                    </div>
                 </div>
                 <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 border border-slate-100 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-3">
                       <Navigation2 className="w-3 h-3 sm:w-4 sm:h-4 text-brand-blue" /> ETA
                    </div>
                    <div className="font-black text-lg sm:text-2xl text-brand-blue drop-shadow-sm">
                       {userPos ? (
                         (() => {
                           const R = 6371e3; // meters
                           const dLat = (userPos.lat - selectedVehicle.lat) * Math.PI / 180;
                           const dLon = (userPos.lng - selectedVehicle.lng) * Math.PI / 180;
                           const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(selectedVehicle.lat * Math.PI / 180) * Math.cos(userPos.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                           const distanceMeters = R * c;
                           const speedKmh = selectedVehicle.speed || 20; // fallback avg 20 kmh
                           const speedMs = speedKmh * (1000 / 3600);
                           const etaMins = Math.max(1, Math.round((distanceMeters / speedMs) / 60));
                           return etaMins > 60 ? '>1 hr' : `${etaMins} Mins`;
                         })()
                       ) : (
                         `${Math.max(1, Math.floor(60 / (selectedVehicle.speed || 30)))} Mins`
                       )}
                    </div>
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-3 relative z-10">
                 <button 
                   onClick={() => {
                     if (mapRef && selectedVehicle) {
                       mapRef.flyTo([selectedVehicle.lat, selectedVehicle.lng], 16, { animate: true, duration: 1 });
                     }
                   }}
                   className="flex-1 bg-brand-blue text-white py-3.5 sm:py-4 rounded-[20px] sm:rounded-[24px] font-extrabold text-sm sm:text-lg hover:bg-brand-indigo hover:scale-[1.02] shadow-[0_8px_24px_-8px_rgba(37,99,235,0.6)] transition-all duration-300"
                 >
                    Locate Target
                 </button>
                 <button 
                   onClick={() => handleSetSelectedVehicleId(null)}
                   className="w-[52px] sm:w-[60px] flex items-center justify-center bg-white rounded-[20px] sm:rounded-[24px] hover:bg-slate-50 hover:scale-[1.02] border border-white/80 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)]"
                 >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
