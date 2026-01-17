import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Heart, Code2, Globe, Github } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-y-auto bg-[#0f172a]">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#0f766e] rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#1e1b4b] rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="inline-block px-4 py-1.5 mb-6 glass-card rounded-full text-sm font-semibold text-teal-200 uppercase tracking-widest border border-teal-500/30 bg-teal-900/20">
                        About MediFind LK
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Connecting You to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Essential Healthcare</span>
                    </h1>
                    <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
                        We bridge the gap between patients and pharmacies, making medicine availability information accessible to everyone in Sri Lanka.
                    </p>
                </motion.div>

                {/* Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Feature
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="Instant Access"
                        desc="Real-time stock checking saves you time and emergency travel."
                    />
                    <Feature
                        icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
                        title="Verified Data"
                        desc="Information sourced directly from registered partner pharmacies."
                    />
                    <Feature
                        icon={<Heart className="w-8 h-8 text-red-400" />}
                        title="Community First"
                        desc="Built to support the Sri Lankan community during critical times."
                    />
                </div>

                {/* Developer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass-card p-8 md:p-12 bg-white/5 border border-white/10 rounded-2xl text-left flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
                        <Code2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Developed by Kavindu</h3>
                        <p className="text-teal-300 font-medium mb-4">IT Undergraduate at SLIIT</p>
                        <p className="text-blue-100/70 mb-6 leading-relaxed">
                            "I built MediFind LK to solve the recurring issue of medicine shortages.
                            My goal is to use technology to make healthcare accessibility simpler and more reliable for every Sri Lankan."
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                                <Globe className="w-4 h-4" /> Personal Website
                            </a>
                            <a href="#" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                                <Github className="w-4 h-4" /> GitHub
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const Feature = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center text-center"
    >
        <div className="p-3 bg-white/5 rounded-full mb-4 border border-white/5">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-blue-100/60 leading-relaxed">{desc}</p>
    </motion.div>
);

export default About;
