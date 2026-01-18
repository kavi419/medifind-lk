import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            toast.error('Please enter both email and password');
            setLoading(false);
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            toast.success('Welcome back!');
            navigate('/');
        } else {
            setError(result.msg || 'Login failed');
            toast.error(result.msg || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-32 pb-12 p-4 relative overflow-y-auto bg-[#0f172a]">
            {/* Simplified Background for Login */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1e1b4b] rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0f766e] rounded-full blur-[120px] opacity-40" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-card p-8 bg-white/5 border border-white/10 relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-blue-100/60">Sign in to manage your inventory</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100/80 pl-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100/80 pl-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:shadow-lg hover:shadow-teal-500/20 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-blue-100/50">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                        Register Pharmacy
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
