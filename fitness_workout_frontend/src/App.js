import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main Fitness Workout App: modern, minimalistic UI for:
 *  - User input (height, weight)
 *  - Personalized exercise recommendations
 *  - Workout timer
 *  - Webcam feed
 *  - Responsive layout following provided style/brand
 */
function App() {
  // Theme handling (default light)
  const [theme, setTheme] = useState("light");

  // User input state
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);

  // Timer state (seconds)
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // Webcam
  const [videoActive, setVideoActive] = useState(false);
  const videoRef = useRef(null);

  // Layout: apply data-theme for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // Webcam logic
  useEffect(() => {
    if (videoActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setVideoActive(false); // fallback if denied
        });
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          let tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((t) => t.stop());
        }
      };
    }
  }, [videoActive]);

  // Handle input change
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);

  // PUBLIC_INTERFACE
  // Calculate recommendations based on height/weight (very simplified)
  function getRecommendations(h, w) {
    // Just for demo: replace this with real logic if backend or more data
    let exerciseList = [];
    const weightNum = parseFloat(w);
    const heightNum = parseFloat(h);
    if (isNaN(heightNum) || isNaN(weightNum)) return [];
    if (weightNum / (heightNum / 100) ** 2 >= 25) {
      exerciseList = [
        { name: "Brisk Walking", duration: "20 min" },
        { name: "Bodyweight Squats", duration: "3 sets × 12 reps" },
        { name: "Knee Push-ups", duration: "3 × 10 reps" }
      ];
    } else {
      exerciseList = [
        { name: "Jumping Jacks", duration: "3 × 30s" },
        { name: "Lunges", duration: "3 × 12 reps" },
        { name: "Plank", duration: "3 × 30s" }
      ];
    }
    return exerciseList;
  }

  // On submit, update recommendations
  const handleSubmit = (e) => {
    e.preventDefault();
    setRecommendations(getRecommendations(height, weight));
    setTimer(0); // reset timer
    setTimerActive(false);
    setVideoActive(false);
  };

  // Start workout: timer + webcam
  const handleStartWorkout = () => {
    setTimer(0);
    setTimerActive(true);
    setVideoActive(true);
  };
  // Stop workout: pause timer + webcam
  const handleStopWorkout = () => {
    setTimerActive(false);
    setVideoActive(false);
  };
  // Reset all
  const handleReset = () => {
    setHeight("");
    setWeight("");
    setRecommendations([]);
    setTimer(0);
    setTimerActive(false);
    setVideoActive(false);
  };

  // PUBLIC_INTERFACE
  // Toggle light/dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Format timer as mm:ss
  const formatTime = (s) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Render
  return (
    <div className="fitness-app-root App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <div className="fitness-main-card">
        {/* Central Input Form */}
        <form className="fitness-input-form" onSubmit={handleSubmit}>
          <h1 className="fitness-title">Personalized Workout Planner</h1>
          <div className="input-row">
            <label>
              Height (cm):
              <input
                type="number"
                min="80"
                max="250"
                required
                value={height}
                onChange={handleHeightChange}
                className="fitness-input"
                inputMode="numeric"
                autoComplete="off"
              />
            </label>
            <label>
              Weight (kg):
              <input
                type="number"
                min="20"
                max="250"
                required
                value={weight}
                onChange={handleWeightChange}
                className="fitness-input"
                inputMode="numeric"
                autoComplete="off"
              />
            </label>
          </div>
          <button
            className="fitness-btn accent"
            type="submit"
            disabled={height === "" || weight === ""}
          >
            View Recommendations
          </button>
          <button className="fitness-btn secondary" type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
        {/* Adjacent Exercise List & Timer */}
        <div className="fitness-sidepanel">
          <div className="fitness-recommendations">
            <h2 className="section-title">Recommended Exercises</h2>
            {recommendations.length === 0 ? (
              <div className="section-placeholder">Enter your stats to get a plan!</div>
            ) : (
              <ul>
                {recommendations.map((ex, i) => (
                  <li key={i}>
                    <span className="ex-name">{ex.name}</span>
                    <span className="ex-duration">{ex.duration}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="fitness-timer">
            <h2 className="section-title">Workout Timer</h2>
            <div className="fitness-timer-display">{formatTime(timer)}</div>
            <div className="timer-btn-row">
              <button
                className="fitness-btn accent"
                onClick={handleStartWorkout}
                type="button"
                disabled={
                  timerActive ||
                  height === "" ||
                  weight === "" ||
                  recommendations.length === 0
                }
              >
                Start Workout
              </button>
              <button
                className="fitness-btn"
                onClick={handleStopWorkout}
                type="button"
                disabled={!timerActive}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
        {/* Webcam Video Display */}
        <div className="fitness-webcam-panel">
          <h2 className="section-title">Live Webcam</h2>
          <div className="fitness-webcam-container">
            {videoActive ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="fitness-webcam-video"
                aria-label="Webcam Feed"
                width="100%"
                height="100%"
                style={{
                  borderRadius: "12px",
                  border: "2px solid var(--border-color)"
                }}
              />
            ) : (
              <div className="webcam-placeholder">
                <span role="img" aria-label="camera" style={{ fontSize: 48 }}>
                  📷
                </span>
                <div style={{ color: "var(--text-primary)", fontSize: "0.9em" }}>
                  Start workout to enable video feed.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="fitness-footer">
        <span style={{ fontSize: "0.9em", opacity: 0.75 }}>
          Made with <span style={{ color: "var(--accent-color)", fontWeight: 600 }}>&#9829;</span> for your fitness journey.
        </span>
      </footer>
    </div>
  );
}

export default App;
