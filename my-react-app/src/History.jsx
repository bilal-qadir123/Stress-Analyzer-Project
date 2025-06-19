import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from './EmailContext';
import axios from 'axios';
import { 
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ComparisonView from './ComparisonView';

const History = () => {
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const { email } = useEmail();

  useEffect(() => {
    axios.post('http://localhost:5000/api/history', {
      email: email
    })
      .then(response => {
        if (response.data && response.status === 200) {
          setOriginalData(response.data.map(item => ({
            ...item,
            created_date: new Date(item.created_date).toLocaleDateString('en-CA')
          })));
        }
      })
      .catch(() => setOriginalData([]))
      .finally(() => setLoading(false));
  }, []);

  const formatLabel = (key) => {
    return key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const filteredData = useMemo(() => {
    let result = originalData;
    
    if (searchTerm) {
      result = result.filter(row => 
        Object.entries(row)
          .filter(([key]) => !['email', 'version'].includes(key))
          .some(([, value]) => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedDate) {
      result = result.filter(row => row.created_date === selectedDate);
    }

    return result;
  }, [originalData, searchTerm, selectedDate]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const columns = [
    { key: 'created_date', label: 'Date', sortable: true },
    { key: 'created_time', label: 'Time', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'anxiety_tension', label: 'Anxiety Tension', sortable: true },
    { key: 'concentration_issues', label: 'Concentration Issues', sortable: true },
    { key: 'frequent_headaches', label: 'Frequent Headaches', sortable: true },
    { key: 'irritability', label: 'Irritability', sortable: true },
    { key: 'loneliness_isolation', label: 'Loneliness Isolation', sortable: true },
    { key: 'rapid_heartbeat', label: 'Rapid Heartbeat', sortable: true },
    { key: 'sadness_low_mood', label: 'Sadness Low Mood', sortable: true },
    { key: 'sleep_issues', label: 'Sleep Issues', sortable: true },
    { key: 'weight_change', label: 'Weight Change', sortable: true },
  ];

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'Eustress': { color: 'bg-blue-100 text-blue-800', icon: <ChartBarIcon className="h-4 w-4" /> },
      'Distress': { color: 'bg-red-100 text-red-800', icon: <ArrowPathIcon className="h-4 w-4" /> },
      'No Stress': { color: 'bg-green-100 text-green-800', icon: <ChartBarIcon className="h-4 w-4" /> }
    };
    
    const { color, icon } = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: null };
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${color}`}>
        {icon}
        {status}
      </span>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-8 bg-gradient-to-r from-blue-900/95 to-blue-800/95 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white font-inter">Assessment History</h1>
        <p className="mt-2 text-emerald-100">Detailed overview of all assessments conducted</p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search records"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="relative">
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select date"
            />
            <CalendarIcon className="h-5 w-6 absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2 justify-end">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              className="rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Assessment Entries</h2>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <motion.div
                  animate={{ rotate: showComparison ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </motion.div>
                {showComparison ? 'Back to Table' : 'Compare Entries'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showComparison ? (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ComparisonView data={sortedData} onBack={() => setShowComparison(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200" aria-label="History table">
                      <thead className="bg-gray-50">
                        <tr>
                          {columns.map((column) => (
                            <th
                              key={column.key}
                              className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                            >
                              {column.sortable ? (
                                <button
                                  className="flex items-center gap-1 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onClick={() => handleSort(column.key)}
                                  aria-label={`Sort by ${column.label}`}
                                >
                                  {column.label}
                                  {sortConfig.key === column.key ? (
                                    sortConfig.direction === 'asc' ? (
                                      <ChevronUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ChevronDownIcon className="h-4 w-4" />
                                    )
                                  ) : (
                                    <ChevronUpDownIcon className="h-4 w-4" />
                                  )}
                                </button>
                              ) : (
                                column.label
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((row, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            {columns.map((column) => (
                              <td
                                key={column.key}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                              >
                                {row[column.key]}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {paginatedData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No records found
                    </div>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                    <button
                      className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Back
                    </button>

                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
                      {sortedData.length} results
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-all"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`px-4 py-2 rounded-xl transition-all ${
                            currentPage === page 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-all"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default History;