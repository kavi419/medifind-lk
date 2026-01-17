import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Activity, ShieldCheck, Pill, Thermometer, AlertCircle, Loader2, X, User, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PharmacyMapModal from './components/PharmacyMapModal';
import SkeletonCard from './components/SkeletonCard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pharmacies from './pages/Pharmacies';
import About from './pages/About';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        <Layout />
      </AuthProvider>
    </Router>
  );
}

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-white bg-[#0f172a]">
      {/* Static Background for coherence across pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#1e1b4b] rounded-full blur-[120px] opacity-70"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#0f766e] rounded-full blur-[120px] opacity-60"
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto glass-card flex justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <Link to="/" className="flex items-center gap-3 decoration-none">
            <div className="p-2 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">MediFind LK</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-white/90 font-medium">
            <Link to="/" className="hover:text-teal-300 transition-colors">Home</Link>
            <Link to="/pharmacies" className="hover:text-teal-300 transition-colors">Pharmacies</Link>
            <Link to="/about" className="hover:text-teal-300 transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 hover:bg-white/5 p-1 rounded-lg transition-colors pb-1">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/50">
                    <User className="w-4 h-4 text-teal-300" />
                  </div>
                  <span className="font-semibold text-white/90">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-red-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all backdrop-blur-md shadow-lg font-semibold tracking-wide">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

// Extracted Home Component (Logic from original App)
function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className={`container mx-auto px-4 flex flex-col items-center min-h-screen z-10 relative transition-all duration-500 ${hasSearched ? 'pt-32' : 'pt-40 justify-center'}`}>

      {/* Hero Section */}
      <motion.div
        layout
        className="max-w-5xl mx-auto w-full text-center z-20"
      >
        <AnimatePresence>
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="inline-block px-4 py-1.5 mb-8 glass-card rounded-full text-sm font-semibold text-teal-200 uppercase tracking-widest border border-teal-500/30 bg-teal-900/20">
                Sri Lanka's #1 Medicine Tracker
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70 tracking-tight leading-tight drop-shadow-sm">
                Find Medicines <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">Instantly</span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                Crowdsourced availability tracker. Stop wasting time calling pharmacies.
                Locate essential medication in real-time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass Search Bar */}
        <motion.div
          layout
          className="glass-card p-2 rounded-2xl max-w-2xl mx-auto flex items-center gap-3 shadow-2xl border border-white/20 relative overflow-hidden group bg-white/5 backdrop-blur-2xl transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <Search className="w-6 h-6 text-white/60 ml-4 z-10" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter medicine name (e.g., Panadol)..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-lg py-3 z-10 focus:ring-0 font-medium"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {hasSearched && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-2 mr-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/25 rounded-xl text-white font-bold transition-all shadow-lg z-10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Stats/Features Cards - Only show if NOT searched */}
      <AnimatePresence>
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-24 mb-24"
          >
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-teal-300" />}
              title="Real-time Updates"
              desc="Live stock availability derived from community reports."
              delay={0.2}
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-purple-300" />}
              title="Islandwide Network"
              desc="Connecting over 500+ pharmacies across Sri Lanka."
              delay={0.4}
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-blue-300" />}
              title="Community Verified"
              desc="Trust score system ensures accurate information."
              delay={0.6}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Section */}
      <AnimatePresence>
        {(hasSearched) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-6xl mt-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-white">Search Results</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="glass-card p-8 text-center text-red-200 bg-red-500/10 border-red-500/20">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <p>{error}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="glass-card p-12 text-center text-blue-100/60 flex flex-col items-center">
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-xl">No pharmacies found with this medicine.</p>
                <p className="text-sm mt-2 opacity-60">Try checking the spelling or search for a generic name.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item, index) => (
                  <ResultCard
                    key={item.id}
                    data={item}
                    index={index}
                    onViewMap={() => setSelectedPharmacy(item.pharmacy)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Modal */}
      <PharmacyMapModal
        pharmacy={selectedPharmacy}
        onClose={() => setSelectedPharmacy(null)}
      />
    </main>
  )
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      className="glass-card p-8 flex flex-col items-start hover:-translate-y-2 bg-white/5 border border-white/10 transition-transform duration-300"
    >
      <div className="p-3 bg-white/10 rounded-2xl mb-5 border border-white/10 shadow-inner ring-1 ring-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
      <p className="text-blue-100/70 leading-relaxed text-sm text-left">{desc}</p>
    </motion.div>
  )
}

function ResultCard({ data, index, onViewMap }) {
  const isAvailable = data.quantity > 0;
  const isLowStock = data.quantity < 10 && isAvailable;

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
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${data.pharmacy.latitude || data.pharmacy.location?.lat},${data.pharmacy.longitude || data.pharmacy.location?.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-2 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group-hover:bg-teal-600/20 group-hover:border-teal-500/30 group-hover:text-teal-200 decoration-none"
      >
        <MapPin className="w-4 h-4" />
        View on Map
      </a>

    </motion.div>
  );
}

export default App;
