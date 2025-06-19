import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiSmile,
  FiAlertTriangle,
  FiArrowLeft,
  FiHeart,
  FiAlertCircle,
  FiBookOpen,
  FiChevronRight,
} from "react-icons/fi";
import { GiHistogram } from "react-icons/gi";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import HeaderBlue from "./HeaderBlue";
import { TbRobot } from "react-icons/tb";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const predictionText =
    location.state?.predictionText || "Eustress (Moderate level)";
  const issues = location.state?.high_values || [];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log("Issues from Result: ", issues);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const resultData = {
    "Eustress (Moderate level)": {
      title: "Productive Stress Level",
      icon: <FiActivity className="w-12 h-12" />,
      color: "bg-blue-500",
      desc: (
        <p className="text-left">
          {" "}
          You’re feeling a positive kind of stress that boosts motivation,
          focus, and performance. It helps you stay driven, creative, and
          achieve your goals. Just remember to balance it to avoid burnout! 🌱💪
        </p>
      ),
      problems: [
        "Temporary work pressure",
        "Exciting challenges",
        "Short-term goals",
        "Creative projects",
      ],
      solutions: [
        "Channel energy into prioritization",
        "Use deadlines as motivation",
        "Balance with regular breaks",
        "Reflect on achievements",
      ],
    },
    "No Stress (0 or very low)": {
      title: "Calm and Balanced",
      icon: <FiSmile className="w-12 h-12" />,
      color: "bg-green-500",
      desc: (
        <p className="text-left">
          You’re in a relaxed and peaceful state, with no stress affecting you.
          Enjoy the calm and keep taking care of yourself. Stay consistent with
          your healthy habits to keep this balance and positive energy going! ✨
        </p>
      ),
      problems: [
        "Potential complacency",
        "Missed growth opportunities",
        "Under-stimulation",
        "Social disengagement",
      ],
      solutions: [
        "Maintain healthy routines",
        "Explore new challenges",
        "Strengthen social connections",
        "Practice mindfulness",
      ],
    },
    "Distress (Extremely high)": {
      title: "Critical Stress Level",
      icon: <FiAlertTriangle className="w-12 h-12" />,
      color: "bg-red-500",
      desc: (
        <p className="text-left">
          Your stress levels are quite high and may be impacting your
          well-being. If not managed, it can lead to burnout and health issues.
          It’s important to take a break, seek support, and find healthy ways to
          relax and recharge. 🌿💆‍♂️
        </p>
      ),
      problems: [
        "Chronic pressure",
        "Sleep disturbances",
        "Emotional exhaustion",
        "Physical symptoms",
      ],
      solutions: [
        "Immediate relaxation techniques",
        "Professional consultation",
        "Priority reassessment",
        "Stress journaling",
      ],
    },
  };
  const handleRedirect = () => {
    if (predictionText.includes("Eustress")) {
      window.location.href = "https://positivepsychology.com/what-is-eustress/";
    } else if (predictionText.includes("No Stress")) {
      window.location.href =
        "https://www.mind.org.uk/information-support/tips-for-everyday-living/stress/";
    } else if (predictionText.includes("Distress")) {
      window.location.href =
        "https://www.verywellmind.com/what-is-distress-3145053";
    }
  };

  const { title, icon, color, desc, problems, solutions } =
    resultData[predictionText] || resultData["Eustress (Moderate level)"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b"
    >
      <HeaderBlue />

      <div className="max-w-6xl mx-auto mt-12 px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className={`p-8 rounded-2xl ${color} text-white backdrop-blur-lg shadow-xl`}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
                  <h2 className="text-3xl font-bold">{title}</h2>
                </div>
                <p className="text-lg mb-6">
                  <span className="text-left"> {desc} </span>
                </p>
              </div>
              {issues.length > 3 && !predictionText.includes("Distress") && (
                <div className="flex items-center gap-4 p-6 mt-[-7rem] bg-red-500 backdrop-blur-sm border border-red-600 rounded-lg shadow-md">
                  <div className="shrink-0 text-red-500 p-4 bg-white rounded-xl shadow-inner">
                    <FiAlertTriangle className="text-4xl" />
                  </div>
                  <p className="text-black text-md leading-tight text-left">
                    <strong> Warning </strong>: The increased warning stress signs in the analysis indicate an alarming situation.
                  </p>
                </div>
              )}
              { predictionText.includes("Distress") && ( 
                <div className="flex items-center gap-4 p-6 mt-[-7rem] bg-white backdrop-blur-sm border border-red-500 rounded-lg shadow-md">
                <div className="shrink-0 text-red-500 p-4 bg-white rounded-xl shadow-inner">
                  <FiAlertTriangle className="text-4xl" />
                </div>
                <p className="text-black text-md leading-tight text-left">
                  <strong> Warning </strong>: The increased warning signs in
                  the analysis could be an alarming situation.
                </p>
              </div>
              )}
              <div className="flex justify-between items-end w-full">
                <button
                  className="flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-white/90 transition"
                  onClick={handleRedirect}
                >
                  <FiBookOpen className="mr-2" /> Learn More
                </button>
                <button
                  className="flex items-center px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                  onClick={() => navigate("/chat", { state: { issues } })}
                >
                  <TbRobot className="mr-2" /> Chat with an expert
                </button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiAlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-semibold">Stress Warning Signs</h3>
              </div>
              {issues.length === 0 ? (
                <div className="flex items-center gap-3 ml-5">
                  <p>No stress factors detected! Keep up the positivity. 🌿</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    {issues.map((issue, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => window.open('https://www.umang.com.pk/', '_blank')}
                    className="flex items-center px-6 py-2 mt-5 ml-[9.5rem] bg-white text-blue-600 rounded-lg hover:bg-white/90 transition"
                  >
                    Take Action <FiChevronRight className="ml-2" />
                  </button>

                </>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiHeart className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold">Recommended Actions</h3>
              </div>
              <ul className="space-y-4" style={{ fontSize: "16px" }}>
                {issues.length === 0 && (
                  <div className="flex items-center gap-3 ml-5">
                    <p>No recommendations detected! You are doing great! 🌸</p>
                  </div>
                )}
                <div className="max-w-6xl mx-auto p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Rapid Heartbeat */}
                    {issues.includes("Rapid Heartbeat") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Deep Breathing
                        </span>
                      </div>
                    )}

                    {issues.includes("Anxiety/Tension") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Muscle Relaxation
                        </span>
                      </div>
                    )}

                    {issues.includes("Sleep Issues") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Sleep Routine
                        </span>
                      </div>
                    )}

                    {issues.includes("Frequent Headaches") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.75 8.25c0-1.967.78-3.75 2.061-5.036.332-.353.753-.584 1.189-.756a.75.75 0 01.954.439l.012.065c.084.324.1.739.006 1.097-.138.502-.322 1.003-.51 1.375a6.987 6.987 0 001.564.924z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Stay Hydrated
                        </span>
                      </div>
                    )}

                    {issues.includes("Irritability") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Light Exercise
                        </span>
                      </div>
                    )}

                    {issues.includes("Concentration Issues") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Focused Blocks
                        </span>
                      </div>
                    )}

                    {issues.includes("Sadness/Low Mood") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Social Connection
                        </span>
                      </div>
                    )}

                    {issues.includes("Loneliness/Isolation") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Join Community
                        </span>
                      </div>
                    )}

                    {issues.includes("Weight Change") && (
                      <div className="bg-white border-2 border-green-500 rounded-lg p-6 h-32 flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700 text-sm">
                          Balanced Diet
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap gap-6 justify-between">
            <button
              className="flex items-center px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              onClick={() => navigate("/questions")}
            >
              <FiArrowLeft className="mr-2" /> Reanalyze
            </button>
            <button
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={() => navigate("/history")}
            >
              <GiHistogram className="mr-2" /> History
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Result;
