import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaChevronRight, FaLeaf, FaRegSmileBeam } from 'react-icons/fa';

const Banner = () => {
  return (
    <section className="py-24 bg-gradient-to-br rounded-lg from-emerald-50 to-sky-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 50 }}
          viewport={{ once: true, margin: "0px" }}
          className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] border border-white/20 p-12"
        >
          <div className="text-center space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block p-6 bg-gradient-to-br from-emerald-400/20 to-sky-300/20 rounded-3xl"
            >
              <div className="p-5 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-2xl shadow-lg">
                <FaBrain className="text-4xl text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-700 to-emerald-600 bg-clip-text text-transparent leading-tight"
            >
              Cultivate Inner Calm, <br className="hidden md:block" />
              <span className="inline-flex items-center gap-3">
                Discover Tranquility
                <FaLeaf className="text-emerald-500 text-3xl" />
              </span>
            </motion.h2>

            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              <Link
                to="/questions"
                className="group relative inline-flex items-center justify-center overflow-hidden
                           rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-7 py-3 text-lg font-semibold text-white
                           shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 15, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  >
                    <FaChartLine className="text-xl" />
                  </motion.div>
                  Take Cognitive Assessment
                  <FaChevronRight className="ml-2 text-sm opacity-70 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>

            <motion.div 
              className="mt-16 max-w-4xl mx-auto space-y-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative h-3 bg-white/50 backdrop-blur-sm rounded-full shadow-inner overflow-hidden">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    repeatType: 'mirror',
                    ease: 'easeInOut'
                  }}
                />
              </div>

              <div className="flex justify-center gap-8 text-sm font-medium text-slate-600">
                {['Calm', 'Focused', 'Energetic'].map((label, idx) => (
                  <motion.div 
                    key={label}
                    whileHover={{ y: -3 }}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    {idx !== 0 && <span className="w-px h-6 bg-slate-300/50" />}
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm transition-all group-hover:bg-emerald-50/50">
                        {idx === 0 && <FaRegSmileBeam className="text-emerald-500" />}
                        {idx === 1 && <FaBrain className="text-sky-500" />}
                        {idx === 2 && <FaLeaf className="text-teal-500" />}
                      </div>
                      <span className="transition-colors group-hover:text-slate-800">{label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* SVG filter for subtle texture */}
      <svg width="0" height="0">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="softLight" />
        </filter>
      </svg>
    </section>
  );
};

export default Banner;