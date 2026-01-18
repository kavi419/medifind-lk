import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Simple time ago helper
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const MedicineCard = ({ data, index, onViewMap }) => {
    const { user, token, updateUserPoints } = useAuth(); // Need to ensure useAuth provides points update capability or we fetch user again

    // Safety check for data
    if (!data || !data.pharmacy || !data.medicine) return null;

    const isAvailable = data.quantity > 0 && data.inStock;
    const isLowStock = data.quantity < 10 && isAvailable;

    const handleVerify = async (status) => {
        if (!user) {
            toast.error('Please login to verify stock.');
            return;
        }

        try {
            const res = await fetch('/api/pharmacy/verify-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    pharmacyId: data.pharmacy.id,
                    medicineId: data.medicine.id,
                    status: status
                })
            });

            const responseData = await res.json();

            if (res.ok) {
                toast.success(`Thanks! You earned 10 points! 🏆`);
                // Optionally update local state or trigger a refresh
                // For now, we rely on the toast feedback
                if (updateUserPoints) updateUserPoints(responseData.points);
            } else {
                toast.error(responseData.msg || 'Verification failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card p-6 flex flex-col gap-4 bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all hover:shadow-lg hover:shadow-teal-500/10 group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isLowStock ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    isAvailable ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                    {isLowStock ? 'Low Stock' : isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-300 border border-blue-500/20">
                    <Thermometer className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{data.medicine.name}</h3>
                    <p className="text-sm text-blue-200/60 mt-0.5">{data.medicine.brand} • {data.medicine.category}</p>
                </div>
            </div>

            <div className="h-px w-full bg-white/5 my-1" />

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-white/90">{data.pharmacy.name}</p>
                        <p className="text-sm text-white/50">{data.pharmacy.location.address}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-left">
                        <p className="text-xs text-white/40 uppercase tracking-wider">Price</p>
                        <p className="text-lg font-bold text-teal-300">LKR {data.price}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-white/40 uppercase tracking-wider">Qty</p>
                        <p className="text-lg font-bold text-white">{data.quantity}</p>
                    </div>
                </div>

                {data.lastUpdatedAt && (
                    <div className="text-xs text-blue-200/40 italic text-center">
                        Verified {timeAgo(data.lastUpdatedAt)}
                        {/* If we had user name populated, we could show it. */}
                    </div>
                )}
            </div>

            {/* Verification Buttons */}
            {user && user.role === 'user' && (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => handleVerify('In Stock')}
                        className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg flex items-center justify-center gap-2 text-green-300 text-sm font-medium transition-colors"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Confirm
                    </button>
                    <button
                        onClick={() => handleVerify('Out of Stock')}
                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center gap-2 text-red-300 text-sm font-medium transition-colors"
                    >
                        <XCircle className="w-4 h-4" /> Empty
                    </button>
                </div>
            )}

            {console.log('MedicineCard Pharmacy Data:', data.pharmacy)}
            <a
                href={`https://www.google.com/maps?q=${data.pharmacy.latitude},${data.pharmacy.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group-hover:bg-teal-600/20 group-hover:border-teal-500/30 group-hover:text-teal-200 decoration-none"
            >
                <MapPin className="w-4 h-4" />
                View on Map
            </a>
        </motion.div>
    );
};

export default MedicineCard;
