import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const StatisticalDataReveal = ({ entry1, entry2, categories }) => {
  return (
    <div className="p-6 space-y-8">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[
          {
            label: 'Avg. Entry 1',
            value:
              categories.reduce((sum, c) => sum + (entry1[c.key] || 0), 0) /
              categories.length,
            bg: 'bg-blue-50',
            text: 'text-blue-600'
          },
          {
            label: 'Avg. Entry 2',
            value:
              categories.reduce((sum, c) => sum + (entry2[c.key] || 0), 0) /
              categories.length,
            bg: 'bg-green-50',
            text: 'text-green-600'
          },
          {
            label: 'Max Change',
            value: Math.max(
              ...categories.map(c =>
                Math.abs((entry2[c.key] || 0) - (entry1[c.key] || 0))
              )
            ),
            bg: 'bg-purple-50',
            text: 'text-purple-600'
          },
          {
            label: 'Total Change',
            value: categories.reduce(
              (sum, c) => sum + ((entry1[c.key] || 0) - (entry2[c.key] || 0)),
              0
            ),
            bg: 'bg-yellow-50',
            text: 'text-yellow-600'
          }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className={`p-4 ${card.bg} rounded-lg`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <p className={`text-sm ${card.text}`}>{card.label}</p>
            <p className="text-xl font-semibold">
              {Math.round(card.value)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-lg font-bold">Statistical Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const v1 = entry1[cat.key] || 0
            const v2 = entry2[cat.key] || 0
            const diff = v1 - v2
            const maxDiff = 4;
            const barWidth = (Math.abs(diff) / maxDiff) * 100;
            return (
              <motion.div
                key={cat.key}
                className="bg-white p-4 rounded shadow"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.75 + i * 0.05 }}
              >
                <p className="font-medium">{cat.label}</p>
                <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">
                <strong>Entry 1:</strong> {v1}
              </span>
              <span className="text-gray-400">
                <strong>Entry 2:</strong> {v2}
              </span>
                  <span className={`font-semibold ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-600'}`}>
                  <strong>Diff:</strong> {diff}
                </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className={`${
                      diff >= 0 ? 'bg-green-500' : 'bg-red-500'
                    } h-2 rounded`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

// ✅ Move propTypes before export
StatisticalDataReveal.propTypes = {
  entry1: PropTypes.objectOf(PropTypes.number).isRequired,
  entry2: PropTypes.objectOf(PropTypes.number).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
}

export default StatisticalDataReveal
