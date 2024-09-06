// File: index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import RunWorkflow from "./RunWorkFlow"; // Assuming you have the RunWorkflow component
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/runWorkflow" element={<RunWorkflow />} />
      </Routes>
    </Router>
  </React.StrictMode>
);