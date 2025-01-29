import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "./components/Settings";
import ReminderSettings from "./components/ReminderSettings";
import DisplaySettings from "./components/DisplaySettings";
import SoundSettings from "./components/SoundSettings";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/settings/reminders" element={<ReminderSettings />} />
        <Route path="/settings/display" element={<DisplaySettings />} />
        <Route path="/settings/sound" element={<SoundSettings />} />
      </Routes>
    </Router>
  );
};

export default App;
