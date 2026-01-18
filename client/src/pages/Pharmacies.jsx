import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Search } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';

const Pharmacies = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const res = await fetch('/api/pharmacy/all');
                if (!res.ok) throw new Error('Failed to fetch pharmacies');
                const data = await res.json();
                setPharmacies(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load pharmacies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPharmacies();
    }, []);

    const filteredPharmacies = pharmacies.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.location?.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 relative overflow-hidden bg-[#0f172a]">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0f766e] rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#1e1b4b] rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Partner Pharmacies</h1>
                        <p className="text-blue-100/60">Find trusted pharmacies in our islandwide network.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by name or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all backdrop-blur-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="glass-card p-8 text-center text-red-200 bg-red-500/10 border-red-500/20">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPharmacies.map((pharmacy, index) => (
                            <motion.div
                                key={pharmacy._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card p-6 bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all hover:shadow-lg hover:shadow-teal-500/10 flex flex-col h-full"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
                                        <Building2 className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white leading-tight mb-1">{pharmacy.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${pharmacy.isVerified ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'}`}>
                                            {pharmacy.isVerified ? 'Verified Partner' : 'Registered'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    <div className="flex items-start gap-3 text-blue-100/70">
                                        <MapPin className="w-5 h-5 text-teal-500/50 shrink-0 mt-0.5" />
                                        <p className="text-sm">{pharmacy.location?.address}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-blue-100/70">
                                        <Phone className="w-5 h-5 text-teal-500/50 shrink-0" />
                                        <p className="text-sm">{pharmacy.contactNumber}</p>
                                    </div>
                                </div>

                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude || pharmacy.location?.lat},${pharmacy.longitude || pharmacy.location?.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group decoration-none"
                                >
                                    <MapPin className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                                    View on Map
                                </a>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pharmacies;
