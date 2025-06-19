import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon, ArrowLeftIcon, ChevronDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import StatisticalDataReveal from './StatisticalDataReveal';
const ComparisonView = ({ data, onBack }) => {
  const [entry1, setEntry1] = useState('');
  const [entry2, setEntry2] = useState('');
  const scaleLabels = {
    1: 'Not at all',
    2: 'Mild',
    3: 'Moderate',
    4: 'High',
    5: 'Very High'
  };

  const labelToValue = {
    'Not at all': 1,
    'Mild': 2,
    'Moderate': 3,
    'High': 4,
    'Very High': 5,
  };
  
  

  

  const categories = [
    { key: 'anxiety_tension', label: 'Anxiety Tension' },
    { key: 'concentration_issues', label: 'Concentration Issues' },
    { key: 'frequent_headaches', label: 'Frequent Headaches' },
    { key: 'irritability', label: 'Irritability' },
    { key: 'loneliness_isolation', label: 'Loneliness Isolation' },
    { key: 'rapid_heartbeat', label: 'Rapid Heartbeat' },
    { key: 'sadness_low_mood', label: 'Sadness Low Mood' },
    { key: 'sleep_issues', label: 'Sleep Issues' },
    { key: 'weight_change', label: 'Weight Change' }
  ];

  const numericEntry = idx => {
    if (idx === '') return {}
    return categories.reduce((acc, { key }) => {
      const raw = data[idx][key]       // e.g. "Mild"
      acc[key] = labelToValue[raw] || 0
      return acc
    }, {})
  }

  const num1 = numericEntry(entry1)
  const num2 = numericEntry(entry2)

  const getEntryLabel = (entry) => {
    if (!entry) return 'Select Entry';
    return `${entry.created_date} ${entry.created_time}`;
  };

  const getComparisonColor = (val1, val2) => {
    const num1 = labelToValue[val1] || 0;
    const num2 = labelToValue[val2] || 0;
    if (num2 < num1) return 'bg-green-100';
    if (num2 > num1) return 'bg-red-100';
    return 'bg-gray-50';
  };


  const getComparisonIcon = (val1, val2) => {
    if (val2 < val1) return <ArrowDownIcon className="h-4 w-4 text-green-600 ml-2" />;
    if (val2 > val1) return <ArrowUpIcon className="h-4 w-4 text-red-600 ml-2" />;
    return <XMarkIcon className="h-4 w-4 text-gray-500 ml-2" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="px-10 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <select
            value={entry1}
            onChange={(e) => setEntry1(e.target.value)}
            className="w-full pl-4 pr-8 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">Select First Entry</option>
            {data.map((entry, index) => (
              <option key={index} value={index}>
                {getEntryLabel(entry)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={entry2}
            onChange={(e) => setEntry2(e.target.value)}
            className="w-full pl-4 pr-8 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">Select Second Entry</option>
            {data.map((entry, index) => (
              <option key={index} value={index}>
                {getEntryLabel(entry)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {entry1 !== '' && entry2 !== '' && (
        <>
          <StatisticalDataReveal
  entry1={num1}
  entry2={num2}
  categories={categories}
/>

          <div className="flex gap-4 mb-6 ml-3">
            <div className="flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-red-600" />
              <span className="ml-2 text-sm">Increased</span>
            </div>
            <div className="flex items-center">
              <ArrowDownIcon className="h-4 w-4 text-green-600" />
              <span className="ml-2 text-sm">Decreased</span>
            </div>
            <div className="flex items-center">
              <XMarkIcon className="h-4 w-4 text-gray-500" />
              <span className="ml-2 text-sm">No Change</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  style={{ position: 'relative', left: '140px' }}
                  >
                    Category
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    {getEntryLabel(data[entry1])}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    {getEntryLabel(data[entry2])}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => {
                  const val1 = data[entry1][category.key];
                  const val2 = data[entry2][category.key];

                  const val1Num = labelToValue[val1] || 0;
                  const val2Num = labelToValue[val2] || 0;
                  const difference = val1Num - val2Num;
                  
                  console.log("Category:", category.label, "Value 1:", val1Num, "Value 2:", val2Num, "Difference:", difference);

                  return (
    <tr key={category.key} className={getComparisonColor(val1, val2)}>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{category.label}</td>
      <td className="px-6 py-4 text-center text-sm text-gray-700">
        {val1} ({scaleLabels[val1]})
      </td>
      <td className="px-6 py-4 text-center text-sm text-gray-700">
        <div className="flex items-center justify-center">
          {val2} ({scaleLabels[val2]})
          {getComparisonIcon(val1, val2)}
        </div>
      </td>
    </tr>
  );
})}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ComparisonView;