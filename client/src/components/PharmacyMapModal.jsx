import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const PharmacyMapModal = ({ pharmacy, onClose }) => {
    if (!pharmacy) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    className="relative w-full max-w-3xl glass-card bg-[#1e293b] border border-white/10 shadow-2xl overflow-hidden rounded-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-teal-400" />
                                {pharmacy.name}
                            </h3>
                            <p className="text-sm text-white/60 mt-1">{pharmacy.location.address}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Map Content */}
                    <div className="w-full h-[400px] relative z-0">
                        <MapContainer
                            center={[pharmacy.location.lat, pharmacy.location.lng]}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[pharmacy.location.lat, pharmacy.location.lng]}>
                                <Popup>
                                    <div className="text-slate-900">
                                        <strong>{pharmacy.name}</strong> <br />
                                        {pharmacy.location.address}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Footer actions */}
                    <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PharmacyMapModal;
