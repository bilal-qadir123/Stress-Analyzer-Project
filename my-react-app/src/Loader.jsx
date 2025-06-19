import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] font-outfit">
      <div className="w-full max-w-2xl px-4">
        <div className="relative h-4 bg-gray-200/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-green-400 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '130%' }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative -mt-8 w-full flex justify-between px-2">
          {['No Stress', 'Eustress', 'Distress'].map((label, idx) => (
            <div key={label} className='mt-7'>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {label}
              </span>
              {idx < 2 && (
                <div className="absolute right-0 top-0 w-px h-6 bg-gray-400 translate-x-full" />
              )}
            </div>))}
        </div>
      </div>
    </div>
  );
};

export default Loader;