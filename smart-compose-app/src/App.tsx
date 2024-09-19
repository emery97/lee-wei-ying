import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import ResultsPage from "./components/ResultsPage";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
