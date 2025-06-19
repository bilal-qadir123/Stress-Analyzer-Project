import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from "./assets/Image1.jpg";
import Form from "./Form";
import { FiArrowDown } from 'react-icons/fi';
import "./App.css";

function Landing() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={Image} 
          alt="Background" 
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0))`
          }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-8"
        >
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
            >
              <span className="bg-gradient-to-r from-green-300 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                Find Your Inner Peace
              </span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
              Personalized mindfulness strategies tailored to your unique stress patterns
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-all" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: showForm ? 1 : 0, y: showForm ? 0 : 40 }}
          className="w-full max-w-2xl mt-8"
          transition={{ duration: 0.4 }}
        >
        </motion.div>
        <Form> </Form>
      </div>
    </div>
  );
}

export default Landing;