import React, { useEffect, useState } from 'react'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import Background from "./assets/Background1.jpg"
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEmail } from './EmailContext'

export default function Login() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isHovered, setIsHovered] = useState(false)
    const [isHoveredGoogle, setIsHoveredGoogle] = useState(false)
    const [isHoveredFacebook, setIsHoveredFacebook] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [isSignUp, setIsSignUp] = useState(true)
    const [errors, setErrors] = useState({ email: '', password: '', username: '' })
    const [showEmailExists, setShowEmailExists] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const { message } = location.state || {}

    const { setEmail: setGlobalEmail } = useEmail()

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const newErrors = {
          email: '',
          password: '',
          username: '',
        }
      
        if (isSignUp && !username.trim()) {
            newErrors.username = 'Username is required';
          } else if (isSignUp && /\d/.test(username)) {
            newErrors.username = 'Name cannot contain numbers';
          }
        if (!email.trim()) newErrors.email = 'Email is required'
        else if (!validateEmail(email.trim())) newErrors.email = 'Invalid email format'
        if (!password.trim()) newErrors.password = 'Password is required'
        else if (password.trim().length < 6) newErrors.password = 'Password must be at least 6 characters'
        
        setErrors(newErrors)
        
        if (!Object.values(newErrors).some(error => error !== '')) {
          setGlobalEmail(email.trim())
      
          try {
            const response = await axios.post('http://localhost:5000/api/send-input', { 
              username: username.trim(),
              email: email.trim(),
              password: password.trim(),
              isSignUp
            })
            
            navigate("/questions")
          } catch (error) {
            if (error.response && error.response.status === 409) {
              setShowEmailExists(true)
              setTimeout(() => {
                setIsSignUp(false)
                setShowEmailExists(false)
              }, 3000)
            }
            else if (error.response && error.response.status === 401) {
                // 👇 NEW HANDLING FOR WRONG CREDENTIALS
                setErrors(prev => ({
                  ...prev,
                  password: 'Password is incorrect'
                }))
              }
                else {
              console.error("Error from server:", error.response ? error.response.data : error.message)
            }
          }
        }
    }      

    useEffect(() => {
        if (message) {
            setEmail(message)
            setErrors(prev => ({ ...prev, email: '' }))
        }
    }, [message])

    useEffect(() => {
        document.body.style.margin = "0"
        document.body.style.padding = "0"
        document.body.style.overflow = "hidden"
        
        const style = document.createElement('style')
        style.textContent = `
            input::placeholder {
                color: #a0aec0;
                font-weight: 300;
            }
            input:focus {
                outline: none;
            }
        `
        document.head.appendChild(style)
        
        return () => document.head.removeChild(style)
    }, [])

    const containerStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#f8f9fa"
    }

    const leftStyle = {
        flex: 1,
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
    }

    const rightStyle = {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #ffffff, #f8f9fa)"
    }

    const inputStyle = (field) => ({
        width: "100%",
        padding: "14px 16px",
        margin: "12px 0",
        border: "1px solid",
        borderRadius: "8px",
        fontSize: "15px",
        fontFamily: "'Outfit', sans-serif",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        borderColor: errors[field] 
            ? "#e53e3e" 
            : focusedField === field 
            ? "#4299e1" 
            : "#e2e8f0",
        boxShadow: errors[field] 
            ? "0 1px 3px rgba(229, 62, 62, 0.2)" 
            : focusedField === field 
            ? "0 1px 3px rgba(66, 153, 225, 0.2)" 
            : "none"
    })

    const errorStyle = {
        color: "#e53e3e",
        fontSize: "14px",
        margin: "-8px 0 12px 16px",
        fontFamily: "'Outfit', sans-serif"
    }

    return (
        <div style={containerStyle}>
            {showEmailExists && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '16px 24px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 1000,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{
                        width: '4px',
                        height: '24px',
                        backgroundColor: '#e53e3e',
                        borderRadius: '2px'
                    }} />
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        color: '#1a202c',
                        fontSize: '14px'
                    }}>
                        User with this email already exists. Please login.
                    </span>
                </div>
            )}
            
            <div style={leftStyle} />
            <div style={rightStyle}>
                <div style={{
                    width: "100%",
                    maxWidth: "655px",
                    padding: "50px",
                    background: "white",
                    borderRadius: "24px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    position: "relative"
                }}>
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <h1 style={{ 
                            fontSize: "28px",
                            fontWeight: "600",
                            color: "#1a202c",
                            marginBottom: "8px",
                            fontFamily: "'Outfit', sans-serif"
                        }}>
                            {isSignUp ? "Get Started" : "Welcome Back"}
                        </h1>
                        <p style={{
                            color: "#718096",
                            fontSize: "15px",
                            fontFamily: "'Outfit', sans-serif"
                        }}>
                            {isSignUp ? "Create your account to continue" : "Sign in to continue"}
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                background: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                transitionDelay: "0.05s",
                                backgroundColor: isHoveredGoogle ? "red" : "white"
                            }}
                            onMouseEnter={() => setIsHoveredGoogle(true)}
                            onMouseLeave={() => setIsHoveredGoogle(false)}
                        >
                            <FaGoogle style={{ color: isHoveredGoogle ? "black" : "red", transitionDelay: "0.05s" }} />
                            <span style = {{ fontFamily: "'Outfit', sans-serif" }}>Continue with Google</span>
                        </button>
                        <button
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                background: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                transitionDelay: "0.05s",
                                backgroundColor: isHoveredFacebook ? "#3A8CD8" : "white"
                            }}
                            onMouseEnter={() => setIsHoveredFacebook(true)}
                            onMouseLeave={() => setIsHoveredFacebook(false)}
                        >
                            <FaFacebook style={{ color: isHoveredFacebook ? "black" : "#3A8CD8", transitionDelay: "0.05s" }} />
                            <span style = {{ fontFamily: "'Outfit', sans-serif" }}>Continue with Facebook</span>
                        </button>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "35px 0",
                        color: "#cbd5e0"
                    }}>
                        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                        <span style={{ padding: "0 12px", fontSize: "14px" }}>OR</span>
                        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ width: "100%", marginLeft: "-15px", marginBottom: "24px" }}>
                            {isSignUp && (
                                <div>
                                    <input
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                            setErrors(prev => ({ ...prev, username: '' }))
                                        }}
                                        type="text"
                                        placeholder="Name"
                                        style={inputStyle('username')}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                    {errors.username && <div style={errorStyle}>{errors.username}</div>}
                                </div>
                            )}
                            <div>
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors(prev => ({ ...prev, email: '' }))
                                    }}
                                    type="email"
                                    placeholder="Email address"
                                    style={inputStyle('email')}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                {errors.email && <div style={errorStyle}>{errors.email}</div>}
                            </div>
                            <div>
                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrors(prev => ({ ...prev, password: '' }))
                                    }}
                                    type="password"
                                    placeholder="Password"
                                    style={inputStyle('password')}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                {errors.password && <div style={errorStyle}>{errors.password}</div>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.95), rgba(30, 64, 175, 0.95))",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "15px",
                                fontWeight: "500",
                                fontFamily: "'Outfit', sans-serif",
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: isHovered ? "translateY(-1px)" : "none",
                                boxShadow: isHovered ? "0 4px 6px rgba(66, 153, 225, 0.3)" : "0 2px 4px rgba(66, 153, 225, 0.2)"
                            }}
                        >
                            {isSignUp ? "Create Account" : "Sign In"}
                        </button>
                    </form>
                    <p style={{
                        textAlign: "center",
                        color: "#718096",
                        fontSize: "14px",
                        fontFamily: "'Outfit', sans-serif",
                        marginTop: "24px"
                    }}>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                        <span 
                            style={{
                                color: "#4299e1",
                                fontWeight: "500",
                                cursor: "pointer"
                            }}
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? "Sign in" : "Sign up"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}