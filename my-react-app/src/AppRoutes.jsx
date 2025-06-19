import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Questions from './Questions';
import Result from './Result';
import ChatInterface from './ChatInterface';
import History from './History';
import { useEmail } from './EmailContext';

function AppRoutes() {
  const { email } = useEmail();
  console.log("Email:", email);

  return (
    <Router> 
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        { email ? ( 
          <> 
            <Route path="/questions" element={<Questions />} />
            <Route path="/result" element={<Result />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/history" element={<History />} />
          </>
        ) : ( 
          <> 
            <Route path="/questions" element={<Login />} />
            <Route path="/result" element={<Login />} />
            <Route path="/chat" element={<Login />} />
            <Route path="/history" element={<Login />} />
          </>
        )}

      </Routes>
    </Router>
  );
}

export default AppRoutes;
