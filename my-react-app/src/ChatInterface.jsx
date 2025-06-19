import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiArrowUp, FiAlertCircle, FiHeart, FiBook, FiSmile, FiSun, FiZap, FiArrowLeft, FiRefreshCw, FiMoon, FiPlus, FiMenu } from 'react-icons/fi';
import { TbRobot } from 'react-icons/tb';
import axios from 'axios';

const generateChatId = () => (Date.now() % 900 + 100) + '_' + (Math.random() * 900 + 100 | 0);



const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(generateChatId());

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesContainerRef = useRef(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const email = sessionStorage.getItem('email');;
  const navigate = useNavigate();
  const location = useLocation();
  const issues = location.state?.issues || [];
  const abortControllerRef = useRef(new AbortController());

  const toggleNightMode = () => setIsNightMode(!isNightMode);

  const formatTextWithBold = (text) => {
    const issuesList = ['Rapid Heartbeat', 'Anxiety/Tension', 'Sleep Issues', 'Frequent Headaches', 'Irritability', 'Concentration Issues', 'Sadness/Low Mood', 'Loneliness/Isolation', 'Weight Change'];
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const issuesPattern = issuesList.map(issue => escapeRegExp(issue)).join('|');
    const issuesRegex = new RegExp(`(${issuesPattern})`, 'g');

    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        const isSpecialIssue = issuesList.some(issue => issue.toLowerCase().includes(content.toLowerCase()));
        return (
          <strong key={`bold-${index}`} style={isSpecialIssue ? { color: '#dc2626' } : {}}>
            {content}
          </strong>
        );
      }

      const segments = part.split(issuesRegex);
      return segments.map((segment, segIndex) => {
        if (issuesList.includes(segment)) {
          return (
            <span key={`red-${index}-${segIndex}`} style={{ color: '#dc2626' }}>
              {segment}
            </span>
          );
        }
        return segment;
      });
    });
  };

  const welcomeSuggestions = [
    { icon: <FiHeart className="w-6 h-6" />, title: "Self-Care Tips", prompt: "Share some quick self-care strategies" },
    { icon: <FiBook className="w-6 h-6" />, title: "Resources", prompt: "Recommend mental health resources" },
    { icon: <FiSmile className="w-6 h-6" />, title: "Positive Affirmations", prompt: "Give me some positive affirmations" },
    { icon: <FiSun className="w-6 h-6" />, title: "Mindfulness", prompt: "Guide me through a breathing exercise" },
  ];

  const rotatingTips = [
    "Take a deep breath 🌬️",
    "You're not alone 💞",
    "Small steps matter 🪴",
    "Self-care is important 💆‍♀️",
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % rotatingTips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    axios.post("http://localhost:5000/api/conversation", { email })
      .then(response => {
        // Transform flat message array into conversations with unique IDs
        const rawMessages = response.data.conversation;
        const groupedConversations = groupMessagesByConversation(rawMessages);
        setConversationHistory(groupedConversations);
      })
      .catch(error => {
        console.error("Error fetching conversation:", error);
      });
  }, []);

  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      axios.post("http://localhost:5000/api/chat", { email, chatId: chatId, messages })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error saving chat:", error);
        });
    }
  }, [messages, currentConversationId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const getAIResponse = async (messages) => {
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => abortControllerRef.current.abort(), 30000);

    const issuesList = Array.isArray(issues) ? issues.join(', ') : "general stress";
    const affectionateChance = Math.random();
    const useAffectionateTerms = affectionateChance < 0.7;

    const instructions = `The user is Pakistani and you are an AI don't tell you are an AI you are a real person, use frequent urdu, short answers, and they are experiencing ${issuesList} so don't start with aray wah or something that seems happy instead it should be friendly and caring, but not flirty. Use emojis as per the need 
    📌 Smileys & People: 😀😂😍🤔😭😡🤯🥳😴😊😢😜😱🥺😆🙄😔😃😤😇
    📌 Animals & Nature: 🐶🐱🦁🐼🌻🌈🌊🔥
    📌 Food & Drink: 🍕🍔🍎🍫☕🥤
    📌 Activities: ⚽🏀🏆🎮🎸🎭🎨
    📌 Travel & Places: 🚗✈️🏝️🏔️🗼🏰
    📌 Objects: 💡📱⌚💻🔑📖
    📌 Symbols: ❤️⭐⚠️❌✔️🎶 
    Reply in a warm, friendly, and slightly playful tone, like a close friend chatting. Be concise, **Bold capitalize first word** mentioned issues with **. 
    Your name is Sereni. Greet the user once, then keep things flowing naturally. ${useAffectionateTerms ? 'Use affectionate but not flirty terms.' : 'Stay warm but skip affectionate terms.'} Keep replies short and engaging.  
    If the user jokes or uses casual language (like "hahaha"), match their vibe. If they go off-topic, gently steer them back, reminding them their health and well-being matter most.`;

    const contents = [
      { role: 'user', parts: [{ text: instructions }] },
      ...messages.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    ];

    const fetchResponse = async (retryCount = 3) => {
      for (let attempt = 0; attempt < retryCount; attempt++) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBZPbat2b-pM2NofcxbFW8f_cYa-M6zQu8`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents }),
              signal: abortControllerRef.current.signal,
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
          }

          const data = await response.json();
          return data?.candidates?.[0]?.content?.parts?.[0]?.text
            .replace(/\\boxed\{(.+?)\}/g, "$1")
            .replace(/```[\s\S]*?```/g, "")
            .trim();
        } catch (err) {
          if (attempt === retryCount - 1) {
            console.error("Chatbot API failed after retries:", err);
            return "I'm having trouble responding right now. Please try again.";
          }
          await new Promise(res => setTimeout(res, 1000));
        }
      }
    };

    return fetchResponse();
  };

  const groupMessagesByConversation = (rawMessages) => {
    const conversations = {};
    rawMessages.forEach((msg, index) => {
      const convId = msg.conversationId || `conv-${Math.floor(index / 5)}`; // Fallback if no conversationId from backend
      if (!conversations[convId]) {
        conversations[convId] = {
          id: convId,
          title: "Title",
          messages: [],
        };
      }
      conversations[convId].messages.push({
        content: msg.content,
        isUser: msg.sender === 'User',
        timestamp: msg.timestamp,
      });
    });
    return Object.values(conversations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setInput('');
    setError(null);

    try {
      setLoading(true);
      setIsConnected(true);

      const newMessage = {
        content: userInput,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      const aiResponse = await getAIResponse(updatedMessages);
      const aiMessage = {
        content: aiResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update or create conversation in history
      setConversationHistory(prev => {
        if (!currentConversationId) {
          const newConvId = new Date().getTime().toString();
          setCurrentConversationId(newConvId);
          setChatId(newConvId); // Optional: if you want chatId and conversationId to match
          return [
            ...prev,
            {
              id: newConvId,
              title: "Title",
              messages: [newMessage, aiMessage],
            },
          ];
        }
        return prev.map(conv => {
          if (conv.id === currentConversationId) {
            return { ...conv, messages: [...conv.messages, newMessage, aiMessage] };
          }
          return conv;
        });
      });      

      setRetryCount(0);
    } catch (err) {
      setInput(userInput);
      const errorMessage = err.message.includes('aborted')
        ? 'Request timed out. Please try again.'
        : 'Connection error. Please try again.';

      setError(errorMessage);
      setIsConnected(false);

      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          handleSubmit(e);
        }, 2000);
      } else {
        setMessages(prev => [...prev, {
          content: "I'm having trouble responding right now. Please try again.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (e) => {
    e.preventDefault();
    setError(null);
    setRetryCount(0);
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  const handleNewConversation = () => {
    setChatId(generateChatId());
    setCurrentConversationId(null);
    setMessages([]);
    setSelectedChat(null);
    setIsSidebarExpanded(true);
  };  

  const loadChat = (convId) => {
    const selectedConversation = conversationHistory.find(conv => conv.id === convId);
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
      setSelectedChat(convId);
      setCurrentConversationId(convId);
      setIsSidebarExpanded(false);
    }
  };

  const SideDecorations = () => (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-0 top-1/4 -translate-x-1/2 hidden lg:block"
      >
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-30" />
          <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full shadow-sm" />
          <FiZap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-0 top-1/3 translate-x-1/2 hidden lg:block"
      >
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-30" />
          <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full shadow-sm" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-2xl font-semibold text-blue-600">24/7</span>
            <p className="text-xs text-gray-600 mt-1">Support</p>
          </div>
        </div>
      </motion.div>
    </>
  );

  const AnimatedTips = () => (
    <motion.div
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity }}
      className={`${isNightMode ? 'text-gray-400' : 'text-gray-600'} mb-4 h-6`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentTipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute inset-x-0"
        >
          {rotatingTips[currentTipIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );

  return (
    <>
      <div className={`flex h-[600px] max-w-6xl mx-auto rounded-2xl shadow-xl border overflow-hidden ${isNightMode ? 'border-gray-800' : 'border-gray-100'}`}>
        {/* Sidebar */}
        <motion.div
          className={`h-full ${isSidebarExpanded ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out ${isNightMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
          layout
        >
          <div className="h-full flex flex-col">
            {isSidebarExpanded ? (
              <>
                <div className={`p-4 border-b ${isNightMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${isNightMode ? 'text-gray-200' : 'text-gray-800'}`}>Chat History</h3>
                    <button
                      onClick={() => setIsSidebarExpanded(false)}
                      className={`p-1 rounded-lg ${isNightMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <FiArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleNewConversation}
                    className={`mt-2 w-full py-2 px-4 rounded-lg text-sm font-medium ${isNightMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    New Chat
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {conversationHistory.map(conv => (
                      <motion.div
                        key={conv.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedChat === conv.id ? (isNightMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (isNightMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                        onClick={() => loadChat(conv.id)}
                      >
                        <span className="text-sm">{conv.title} ({conv.id})</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center py-4">
                <button
                  onClick={handleNewConversation}
                  className={`p-2 rounded-lg relative group ${isNightMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} mb-4`}
                >
                  <FiPlus className="w-6 h-6" />
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    New Chat
                  </span>
                </button>
                <button
                  onClick={() => setIsSidebarExpanded(true)}
                  className={`p-2 rounded-lg ${isNightMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiMenu className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${isNightMode ? 'bg-gray-900' : 'bg-white'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 border-b ${isNightMode ? 'border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900' : 'border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100'}`}
          >
            <div className="flex items-center gap-4">
              <TbRobot className={`w-8 h-8 ${isNightMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h2 className={`text-xl font-semibold ${isNightMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  Serenity Assistant
                </h2>
                <p className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Available 24/7 to listen and support
                </p>
              </div>
              <div className="flex items-center ml-auto gap-4">
                <button
                  onClick={toggleNightMode}
                  className={`p-2 rounded-lg ${isNightMode ? 'text-gray-300 hover:text-gray-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {isNightMode ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                </button>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
                  <span className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isConnected ? 'Connected' : 'Reconnecting...'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div
            ref={messagesContainerRef}
            className={`flex-1 overflow-y-auto p-6 relative ${isNightMode ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 p-6 flex flex-col items-center justify-center"
                >
                  <div className="text-center mb-8">
                    <TbRobot className={`w-12 h-12 mx-auto mb-4 ${isNightMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`text-2xl font-semibold mb-2 ${isNightMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      How can I help you today?
                    </h3>
                    <AnimatedTips />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {welcomeSuggestions.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border transition-all text-left group shadow-lg ${isNightMode ? 'bg-gray-700 border-gray-600 hover:border-blue-400' : 'bg-white border-gray-200 hover:border-blue-200'}`}
                        onClick={() => setInput(item.prompt)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isNightMode ? 'bg-gray-600 text-blue-400 group-hover:bg-gray-500' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                            {item.icon}
                          </div>
                          <div>
                            <h4 className={`font-medium ${isNightMode ? 'text-gray-100' : 'text-gray-800'}`}>
                              {item.title}
                            </h4>
                            <p className={`text-sm mt-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.prompt}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`space-y-4 ${messages.length === 0 ? 'invisible' : ''}`}>
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-4 ${message.isUser ? (isNightMode ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white') : (isNightMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-200')} ${!message.isUser && 'border'} shadow-lg`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.isUser ? (
                          <FiUser className="w-4 h-4" />
                        ) : (
                          <TbRobot className="w-4 h-4" />
                        )}
                        <span className={`text-xs ${isNightMode ? 'opacity-60' : 'opacity-75'}`}>
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="leading-relaxed text-left">
                        {formatTextWithBold(message.content)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className={`max-w-[90%] rounded-2xl p-4 ${isNightMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <TbRobot className="w-4 h-4" />
                        <span className={`text-xs ${isNightMode ? 'opacity-60' : 'opacity-75'}`}>
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                        </div>
                        <span>Serenity is typing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`p-4 border-t ${isNightMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={loading ? "Serenity is responding..." : "Type your message..."}
                className={`w-full pr-20 pl-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent ${isNightMode ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500' : 'border-gray-200 focus:ring-blue-500'}`}
                disabled={loading}
              />
              <div className="absolute right-2 top-2 flex gap-2">
                {error && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className={`p-2 rounded-xl transition-colors flex items-center ${isNightMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  >
                    <FiRefreshCw className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={`p-2 rounded-xl transition-colors ${isNightMode ? 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300'}`}
                >
                  {loading ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                    </div>
                  ) : (
                    <FiArrowUp className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className={`mt-2 flex items-center gap-2 text-sm ${isNightMode ? 'text-red-400' : 'text-red-500'}`}>
                <FiAlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="mt-4 mb-4">
        <div className="flex flex-wrap gap-6 justify-between max-w-6xl mx-auto">
          <button
            className="flex items-center px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft className="mr-2" /> Back to result
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;