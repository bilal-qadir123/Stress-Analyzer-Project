import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Form() {
  const [hover, setHover] = useState(false);
  const [getStartedEmail, setGetStartedEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = getStartedEmail.trim();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    const data = { message: email };
    navigate("/login", { state: data });
  };

  return (
    <div className="absolute top-[70%] left-[44.5%] -translate-x-1/2 -translate-y-1/2 w-[33%]">
      <form className="relative" onSubmit={handleSubmit}>
        <div className="relative group">
          {emailError ? (
                      <FiMail className="absolute left-4 top-6 -translate-y-1/2 text-red-500 w-5 h-5 z-10" />
          ) :  
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/80 w-5 h-5 z-10" />
        }
          <input
            type="email"
            value={getStartedEmail}
            onChange={(e) => {
              setGetStartedEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="Your Email"
            className={`w-full px-12 py-2.5 bg-transparent border-2 rounded-lg
              text-white placeholder:text-blue-100/60 font-outfit font-normal
              focus:ring-4 transition-all duration-200 outline-none backdrop-blur-sm
              ${emailError ? 
                'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 
                'border-blue-400/40 focus:border-blue-400 focus:ring-blue-400/20'}`}
          />
          {emailError && (
            <div className="text-red-500 text-sm mb-1 ml-2">{emailError}</div>
          )}
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2
            font-medium text-white shadow-lg transition-all hover:from-blue-600
            hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-4
            focus:ring-blue-500/50"
          style={{
            position: "absolute",
            top: "50%",
            right: "-35%",
            transform: "translateY(-50%)",
            backgroundColor: hover ? "#3A8CD8" : "#61ABFA",
            transition: "background-color 0.3s ease",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontFamily: "Outfit",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          GET STARTED
        </button>
      </form>
    </div>
  );
}

export default Form;