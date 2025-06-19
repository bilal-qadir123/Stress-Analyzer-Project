import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEmail } from './EmailContext';
import axios from 'axios';

const QuestionsArray = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [ageInput, setAgeInput] = useState('');
  const [inputError, setInputError] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const { email } = useEmail();

  const navigate = useNavigate();
  const location = useLocation();

  const options = useMemo(() => ["Not at all", "Mild", "Moderate", "High", "Very High"], []);
  
  const questions = useMemo(() => [
    { id: 'age', text: "What is your age?", input: true },
    { id: 'rapid_heartbeat', text: "Have you noticed a rapid heartbeat or palpitations?", options: options },
    { id: 'anxiety_tension', text: "Have you been dealing with anxiety or tension recently?", options: options },
    { id: 'sleep_issues', text: "Do you face any sleep problems or difficulties falling asleep?", options: options },
    { id: 'frequent_headaches', text: "Have you been getting headaches more often than usual?", options: options },
    { id: 'irritability', text: "Do you get irritated easily?", options: options },
    { id: 'concentration_issues', text: "Do you have trouble concentrating on your academic tasks?", options: options },
    { id: 'sadness_low_mood', text: "Have you been feeling sadness or low mood?", options: options },
    { id: 'loneliness_isolation', text: "Do you often feel lonely or isolated?", options: options },
    { id: 'weight_change', text: "Have you gained or lost weight recently?", options: options }
  ], [options]);

  const progress = (currentIndex / questions.length) * 100;

  const handleNext = () => {
    if (validateInput()) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: value
    }));
  };

  const handleSubmit = () => {
    const encodedAnswers = {};
    const values = {};
    Object.entries(answers).forEach(([key, value]) => {
      if (key === 'age') {
        encodedAnswers[key] = value;
        values[key] = value;
        return;
      }
      const encodedValue = 
        value === "Not at all" ? "1" :
        value === "Mild" ? "2" :
        value === "Moderate" ? "3" :
        value === "High" ? "4" : "5";
      encodedAnswers[key] = encodedValue;
      values[key] = value;
    });
    
    axios.post('http://localhost:5000/api/answers', { 
      answers: encodedAnswers,
      values: values,
      email: email 
    })
    .then(response => {
      setPredictionResult(response.data.prediction_text);
      let high_values = response.data.high_values.map(item => item.split(":")[0].trim());
      const predictionText = response.data.prediction_text;
      console.log("Email:", email);
      axios.post('http://localhost:5000/api/send-email', { 
        email: email,
        predictionText,
        high_values
      });
      navigate('/result', { state: { predictionText, high_values } });
    })
    .catch(error => console.error('Submission error:', error));
  };

  const validateInput = () => {
    if (questions[currentIndex].input) {
      if (!ageInput || isNaN(ageInput) || Number(ageInput) <= 0) {
        setInputError(true);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') handleNext();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, selectedOption, ageInput]);

  useEffect(() => {
    if (currentIndex < questions.length) {
      const currentAnswer = answers[questions[currentIndex].id];
      if (questions[currentIndex].input) {
        setAgeInput(currentAnswer || '');
      } else {
        setSelectedOption(currentAnswer || null);
      }
    }
  }, [currentIndex, answers, questions]);

  return (
    <div className="min-h-screen bg-gradient-to-b p-8">
      <h1 className="heading text-blue-900" style={{ position: "absolute", top: "75%", left: "50%", transform: "translate(-50%)", lineHeight: "1.2", marginTop: "70px", fontSize: "30px", fontWeight: "bold", zIndex: "1" }}>
        Answer the following 10 questions
      </h1>

      <div className="max-w-4xl mx-auto mb-8 bg-gray-200 rounded-full h-2.5" style={{ marginTop: "650px" }}>
        <motion.div 
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {currentIndex < questions.length ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
            style={{ marginTop: "50px" }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {questions[currentIndex].text}
            </h2>

            {questions[currentIndex].input ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={ageInput}
                  onChange={(e) => {
                    setAgeInput(e.target.value);
                    setAnswers(prev => ({ ...prev, age: e.target.value }));
                    setInputError(false);
                  }}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    inputError ? 'border-red-500 focus:ring-red-200' : 'border-blue-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter your age"
                />
                {inputError && <p className="text-red-500 text-sm">Please enter a valid age</p>}
              </div>
            ) : (
              <div className="grid gap-3">
                {questions[currentIndex].options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 text-left rounded-lg border transition-all ${
                      selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        selectedOption === option ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                      }`}>
                        {selectedOption === option && <FiCheck className="text-white text-sm" />}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <motion.button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                  currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <FiArrowLeft className="mr-2" />
                Previous
              </motion.button>

              <div className="text-gray-500 text-sm">
                Question {currentIndex + 1} of {questions.length}
              </div>

              <motion.button
                onClick={handleNext}
                className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                  (questions[currentIndex].input ? !ageInput : !selectedOption)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={questions[currentIndex].input ? !ageInput : !selectedOption}
              >
                {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
                <FiArrowRight className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Assessment Complete!
          </h2>
          <button
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleSubmit}
          >
            View Results
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuestionsArray;