import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaBrain, FaChartLine, FaHandHoldingHeart, FaHistory, FaComments } from 'react-icons/fa';

const features = [
  {
    icon: <FaLeaf className="text-4xl" />,
    title: "Holistic Approach",
    content: "Combines AI analysis with mindfulness techniques for comprehensive stress management.",
    color: "text-green-500"
  },
  {
    icon: <FaBrain className="text-4xl" />,
    title: "Cognitive Analysis",
    content: "ML model trained on 50,000+ anonymized mental health assessments.",
    color: "text-blue-500"
  },
  {
    icon: <FaChartLine className="text-4xl" />,
    title: "Progress Tracking",
    content: "Visualize your stress patterns and track improvement over time.",
    color: "text-purple-500"
  }
];

const offerings = [
  {
    icon: <FaHandHoldingHeart className="w-6 h-6" />,
    title: "Personalized Guidance"
  },
  {
    icon: <FaHistory className="w-6 h-6" />,
    title: "History Tracking"
  },
  {
    icon: <FaComments className="w-6 h-6" />,
    title: "Expert Support"
  }
];

const Test = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      <div style={{ 
        margin: 0, 
        padding: 0, 
        width: '99vw', 
        height: '115vh', 
        backgroundColor: '#E0F2FE99',
        position: 'absolute', 
        top: -33, 
        left: -42,
        zIndex: -1
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-12 lg:gap-24"
        >
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Science-Backed Stress Management
            </h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.content}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="space-y-8">
              <div className="text-green-600">
                <FaChartLine className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Assessment Process
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  '5-minute questionnaire',
                  'AI-powered analysis',
                  'Personalized report',
                  'Recommended actions',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                What we offer
              </h3>
              <div className="space-y-6">
                {offerings.map((item, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-blue-100 text-green-500 rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-gray-600 font-medium">{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Test;