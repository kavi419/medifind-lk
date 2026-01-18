import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard';
import { Building2, MapPin, Phone, CheckCircle2, Loader2, ArrowRight, Package, Trash2, Edit2, X } from 'lucide-react';

const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [pharmacy, setPharmacy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        contactNumber: '',
        latitude: '',
        longitude: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Stock Management State
    const [medicines, setMedicines] = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [stockForm, setStockForm] = useState({
        medicineId: '',
        price: '',
        quantity: '',
        inStock: true
    });
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Check if user is a normal user (not owner or admin)
        if (user.role === 'user') {
            setLoading(false);
            return;
        }

        const fetchPharmacy = async () => {
            try {
                const res = await fetch('/api/pharmacy/mine', {
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setPharmacy(data);
                    // If pharmacy exists, fetch stock variables
                    fetchInitialData(token);
                } else {
                    // 404 means no pharmacy linked yet, which is fine
                    setPharmacy(null);
                }
            } catch (err) {
                console.error("Failed to fetch pharmacy", err);
                setError('Failed to load pharmacy data.');
            } finally {
                setLoading(false);
            }
        };

        const fetchInitialData = async (authToken) => {
            try {
                const [medRes, stockRes] = await Promise.all([
                    fetch('/api/pharmacy/medicines/all', { headers: { 'x-auth-token': authToken } }),
                    fetch('/api/pharmacy/stock', { headers: { 'x-auth-token': authToken } })
                ]);

                if (medRes.ok) setMedicines(await medRes.json());
                if (stockRes.ok) setStockItems(await stockRes.json());

            } catch (e) {
                console.error("Error loading stock data", e);
            }
        }

        fetchPharmacy();
    }, [user, token, navigate]);

    const handleAddStock = async (e) => {
        e.preventDefault();

        // Stock Validation
        if (!stockForm.medicineId) {
            toast.error('Please select a medicine');
            return;
        }
        if (Number(stockForm.price) <= 0) {
            toast.error('Price must be greater than 0');
            return;
        }
        if (Number(stockForm.quantity) <= 0) {
            toast.error('Quantity must be greater than 0');
            return;
        }

        setIsAddingStock(true);
        try {
            const url = editingItem
                ? `/api/pharmacy/stock/${editingItem._id}`
                : '/api/pharmacy/stock';

            const method = editingItem ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(stockForm)
            });

            if (res.ok) {
                const newItem = await res.json();

                if (editingItem) {
                    // Update existing item in list
                    setStockItems(prev => prev.map(item =>
                        item._id === newItem._id ? newItem : item
                    ));
                    toast.success('Stock updated successfully!');
                } else {
                    // Add or update local list (check if existing to replace, or add new)
                    setStockItems(prev => {
                        const index = prev.findIndex(item => item.medicineId._id === newItem.medicineId._id);
                        if (index > -1) {
                            const newList = [...prev];
                            newList[index] = newItem;
                            return newList;
                        }
                        return [newItem, ...prev];
                    });
                    toast.success('Stock added successfully!');
                }
                resetStockForm();
            } else {
                toast.error('Failed to save stock');
            }
        } catch (err) {
            toast.error('Error saving stock');
        } finally {
            setIsAddingStock(false);
        }
    };

    const resetStockForm = () => {
        setStockForm({ medicineId: '', price: '', quantity: '', inStock: true });
        setEditingItem(null);
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setStockForm({
            medicineId: item.medicineId._id,
            price: item.price,
            quantity: item.quantity,
            inStock: item.inStock
        });
        // Scroll to form if needed, or keeping it sticky is fine
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stock item?')) return;

        try {
            const res = await fetch(`/api/pharmacy/stock/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setStockItems(prev => prev.filter(item => item._id !== id));
                if (editingItem && editingItem._id === id) {
                    resetStockForm();
                }
                toast.success('Stock item removed');
            } else {
                toast.error('Failed to delete item');
            }
        } catch (err) {
            toast.error('Error deleting item');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/pharmacy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setPharmacy(data);
            } else {
                setError(data.msg || 'Failed to register pharmacy');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePharmacy = async (e) => {
        e.preventDefault();

        // Pharmacy Settings Validation
        if (!formData.name || !formData.address || !formData.city) {
            toast.error('Name, Address, and City are required');
            return;
        }

        // Contact Number Validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.contactNumber)) {
            toast.error('Contact number must be exactly 10 digits');
            return;
        }

        // Lat/Lng Validation
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);

        if (isNaN(lat) || isNaN(lng)) {
            toast.error('Latitude and Longitude must be valid numbers');
            return;
        }

        if (lat < -90 || lat > 90) {
            toast.error('Latitude must be between -90 and 90');
            return;
        }

        if (lng < -180 || lng > 180) {
            toast.error('Longitude must be between -180 and 180');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/pharmacy/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setPharmacy(data);
                toast.success('Pharmacy details updated successfully!');
            } else {
                toast.error(data.msg || 'Failed to update details');
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Pre-fill form when pharmacy data loads
    useEffect(() => {
        if (pharmacy) {
            setFormData({
                name: pharmacy.name || '',
                address: pharmacy.location?.address?.split(',')[0] || '', // Simple split for demo
                city: pharmacy.location?.address?.split(',')[1]?.trim() || '',
                contactNumber: pharmacy.contactNumber || '',
                latitude: pharmacy.latitude || pharmacy.location?.lat || '',
                longitude: pharmacy.longitude || pharmacy.location?.lng || ''
            });
        }
    }, [pharmacy]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 bg-[#0f172a] text-white flex flex-col items-center relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#1e1b4b] rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0f766e] rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="w-full max-w-4xl z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-blue-200">
                            {user.role === 'user' ? 'User Dashboard' : 'Owner Dashboard'}
                        </h1>
                        <p className="text-blue-100/60 mt-1">
                            {user.role === 'user'
                                ? 'Track your contributions and help the community.'
                                : 'Manage your pharmacy and inventory.'}
                        </p>
                        <p className="text-xs text-white/20 mt-2 font-mono">Current Role: {user.role}</p>
                    </div>
                </div>

                {user.role === 'user' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <div className="glass-card p-8 bg-white/5 border border-white/10 mb-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-teal-500/20">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Welcome, {user.name}!</h2>
                                    <p className="text-blue-100/60">Ready to find medicines?</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-sm text-blue-100/60 uppercase tracking-wider mb-1">Contribution Points</p>
                                    <div className="text-4xl font-bold text-teal-300">{user.points || 0} 🏆</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl p-8 border border-white/10 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Find Medicines Nearby</h3>
                            <p className="text-blue-100/70 mb-6 max-w-xl mx-auto">
                                Search for available medicines in pharmacies near you. Help the community by updating stock status and earn points!
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 mx-auto"
                            >
                                Go to Search <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        {!pharmacy ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-8 bg-white/5 border border-white/10"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-teal-500/20 rounded-full text-teal-300 border border-teal-500/30">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Register Your Pharmacy</h2>
                                        <p className="text-sm text-blue-100/60">Link your pharmacy to start adding stock.</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-100/80">Pharmacy Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                            placeholder="e.g. City Health Pharmacy"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-100/80">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.contactNumber}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setFormData({ ...formData, contactNumber: val });
                                                }}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                placeholder="0771234567"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-blue-100/80">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                placeholder="No. 123, Main Street"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-100/80">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                            placeholder="e.g. Colombo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-100/80">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                            placeholder="e.g. 6.9271"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-100/80">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                            placeholder="e.g. 79.8612"
                                        />
                                    </div>

                                    <div className="md:col-span-2 text-xs text-blue-200/50 italic text-center">
                                        Tip: Right-click your location on Google Maps to copy Lat/Lng
                                    </div>

                                    <div className="md:col-span-2 mt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:shadow-lg hover:shadow-teal-500/20 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Pharmacy'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full"
                            >
                                {/* Welcome Header */}
                                <div className="glass-card p-8 bg-white/5 border border-white/10 mb-8 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">Welcome, {pharmacy.name}</h2>
                                        <div className="flex items-center gap-4 text-sm text-blue-100/60">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {pharmacy.location.address}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" /> {pharmacy.contactNumber}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-teal-500/10 rounded-full border border-teal-500/20">
                                        <Building2 className="w-8 h-8 text-teal-300" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Add Stock Form */}
                                    <div className="lg:col-span-1">
                                        <div className="glass-card p-6 bg-white/5 border border-white/10 sticky top-24">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    {editingItem ? <Edit2 className="w-5 h-5 text-yellow-400" /> : <Package className="w-5 h-5 text-teal-400" />}
                                                    {editingItem ? 'Edit Stock' : 'Add New Stock'}
                                                </span>
                                                {editingItem && (
                                                    <button
                                                        onClick={resetStockForm}
                                                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white/70 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </h3>

                                            <form onSubmit={handleAddStock} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-100/70 mb-1">Medicine</label>
                                                    <select
                                                        required
                                                        value={stockForm.medicineId}
                                                        onChange={(e) => setStockForm({ ...stockForm, medicineId: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500/50 [&>option]:bg-[#0f172a]"
                                                    >
                                                        <option value="">Select Medicine</option>
                                                        {medicines.map(med => (
                                                            <option key={med._id} value={med._id}>
                                                                {med.name} - {med.brand} ({med.category})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-100/70 mb-1">Price (LKR)</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="0"
                                                            value={stockForm.price}
                                                            onChange={(e) => setStockForm({ ...stockForm, price: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500/50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-100/70 mb-1">Quantity</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="0"
                                                            value={stockForm.quantity}
                                                            onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500/50"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="inStock"
                                                        checked={stockForm.inStock}
                                                        onChange={(e) => setStockForm({ ...stockForm, inStock: e.target.checked })}
                                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-teal-500 focus:ring-teal-500/50"
                                                    />
                                                    <label htmlFor="inStock" className="text-sm text-blue-100/80">Available in Stock</label>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isAddingStock}
                                                    className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 ${editingItem
                                                        ? 'bg-yellow-600 hover:bg-yellow-500'
                                                        : 'bg-teal-600 hover:bg-teal-500'
                                                        }`}
                                                >
                                                    {isAddingStock ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingItem ? 'Update Stock' : 'Add to Inventory')}
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Inventory List */}
                                    <div className="lg:col-span-2">
                                        <div className="glass-card p-6 bg-white/5 border border-white/10">
                                            <h3 className="text-lg font-bold text-white mb-4">My Inventory</h3>

                                            {loading ? (
                                                <div className="space-y-4">
                                                    {[...Array(3)].map((_, i) => (
                                                        <SkeletonCard key={i} />
                                                    ))}
                                                </div>
                                            ) : stockItems.length === 0 ? (
                                                <div className="text-center py-12 text-white/30 border-2 border-dashed border-white/5 rounded-xl">
                                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                    <p>No inventory items yet.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {stockItems.map(item => (
                                                        <div key={item._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${editingItem && editingItem._id === item._id
                                                            ? 'bg-yellow-500/10 border-yellow-500/30'
                                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                                            }`}>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-white">{item.medicineId.name}</h4>
                                                                <p className="text-sm text-white/50">{item.medicineId.brand} • {item.medicineId.category}</p>
                                                            </div>
                                                            <div className="flex items-center gap-6 text-right mr-4">
                                                                <div>
                                                                    <p className="text-xs text-white/40 uppercase">Price</p>
                                                                    <p className="font-bold text-teal-300">LKR {item.price}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-white/40 uppercase">Qty</p>
                                                                    <p className="font-bold text-white">{item.quantity}</p>
                                                                </div>
                                                                <div className={`w-3 h-3 rounded-full ${item.inStock ? 'bg-green-500 shadow-green-500/50 shadow-sm' : 'bg-red-500'}`} />
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex flex-col gap-2 pl-4 border-l border-white/10">
                                                                <button
                                                                    onClick={() => handleEditClick(item)}
                                                                    className="p-2 hover:bg-yellow-500/20 text-yellow-200/50 hover:text-yellow-200 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteClick(item._id)}
                                                                    className="p-2 hover:bg-red-500/20 text-red-200/50 hover:text-red-200 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Settings Section */}
                                <div className="mt-8">
                                    <details className="group glass-card bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                        <summary className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Building2 className="w-5 h-5 text-teal-400" />
                                                Pharmacy Settings
                                            </h3>
                                            <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform text-white/50" />
                                        </summary>
                                        <div className="p-6 border-t border-white/10">
                                            <form onSubmit={handleUpdatePharmacy} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-blue-100/80">Pharmacy Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-blue-100/80">Contact Number</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.contactNumber}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                            setFormData({ ...formData, contactNumber: val });
                                                        }}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-sm font-medium text-blue-100/80">Address</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-blue-100/80">Latitude</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        required
                                                        value={formData.latitude}
                                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-blue-100/80">Longitude</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        required
                                                        value={formData.longitude}
                                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-teal-500/50"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 text-xs text-blue-200/50 italic text-center">
                                                    Tip: Right-click your location on Google Maps to copy Lat/Lng
                                                </div>
                                                <div className="md:col-span-2">
                                                    <button
                                                        type="submit"
                                                        disabled={submitting}
                                                        className="w-full py-3 bg-teal-600 hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/20 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Details'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </details>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
