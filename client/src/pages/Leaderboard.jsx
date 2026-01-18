import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, User, Crown } from 'lucide-react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/users/leaderboard');
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/50"><Crown className="w-5 h-5" /></div>;
            case 1: return <div className="w-8 h-8 rounded-full bg-gray-300/20 text-gray-300 flex items-center justify-center border border-gray-300/50"><Medal className="w-5 h-5" /></div>;
            case 2: return <div className="w-8 h-8 rounded-full bg-orange-700/20 text-orange-400 flex items-center justify-center border border-orange-700/50"><Medal className="w-5 h-5" /></div>;
            default: return <div className="w-8 h-8 rounded-full bg-white/5 text-white/50 flex items-center justify-center font-bold text-sm">{index + 1}</div>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 flex justify-center text-white">
                <div className="text-center">
                    <p className="text-xl animate-pulse text-teal-300">Loading Leaderboard...</p>
                </div>
            </div>
        );
    }

    // Split top 3 and rest
    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <div className="min-h-screen pt-32 px-4 pb-12 text-white flex flex-col items-center">

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300">
                    Community Heroes
                </h1>
                <p className="text-blue-100/60 max-w-lg mx-auto">
                    Top contributors who help keep our medicine database accurate and up-to-date.
                </p>
            </div>

            <div className="w-full max-w-3xl">
                {/* Top 3 Podium */}
                {top3.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                        {/* 2nd Place */}
                        {top3[1] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="order-2 md:order-1 glass-card p-6 bg-white/5 border border-white/10 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-400/10 to-transparent" />
                                <div className="w-16 h-16 rounded-full bg-gray-400/20 border-2 border-gray-400 mb-4 flex items-center justify-center text-2xl font-bold text-gray-300 shadow-lg shadow-gray-400/20">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{top3[1].name}</h3>
                                <p className="text-2xl font-bold text-teal-300">{top3[1].points} <span className="text-sm font-normal text-white/50">pts</span></p>
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {top3[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="order-1 md:order-2 glass-card p-8 bg-gradient-to-b from-yellow-500/10 to-white/5 border border-yellow-500/30 flex flex-col items-center text-center relative transform md:-translate-y-4 shadow-xl shadow-yellow-500/10"
                            >
                                <div className="absolute top-0 right-0 p-2"><Crown className="w-6 h-6 text-yellow-400 rotate-12" /></div>
                                <div className="w-24 h-24 rounded-full bg-yellow-500/20 border-4 border-yellow-400 mb-4 flex items-center justify-center text-4xl font-bold text-yellow-300 shadow-lg shadow-yellow-500/30">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{top3[0].name}</h3>
                                <p className="text-3xl font-bold text-yellow-300">{top3[0].points} <span className="text-sm font-normal text-white/50">pts</span></p>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {top3[2] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="order-3 glass-card p-6 bg-white/5 border border-white/10 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-700/10 to-transparent" />
                                <div className="w-16 h-16 rounded-full bg-orange-700/20 border-2 border-orange-700 mb-4 flex items-center justify-center text-2xl font-bold text-orange-400 shadow-lg shadow-orange-700/20">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{top3[2].name}</h3>
                                <p className="text-2xl font-bold text-teal-300">{top3[2].points} <span className="text-sm font-normal text-white/50">pts</span></p>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* The Rest List */}
                {rest.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="glass-card bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden"
                    >
                        {rest.map((user, idx) => (
                            <div key={user._id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                <div className="flex-none font-medium text-white/50 w-8 text-center">
                                    {idx + 4}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{user.name}</h4>
                                </div>
                                <div className="flex-none font-bold text-teal-300">
                                    {user.points} pts
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {users.length === 0 && (
                    <div className="text-center py-12 opacity-50">
                        <Trophy className="w-16 h-16 mx-auto mb-4" />
                        <p>No contributors yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
