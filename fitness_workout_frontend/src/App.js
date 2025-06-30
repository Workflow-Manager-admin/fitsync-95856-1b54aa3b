import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/**
 * App component for Fitness Workout Frontend.
 * Manages user input for height/weight, personalized recommendations,
 * workout timer logic, and webcam feed, styled in modern, minimal fashion.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [videoError, setVideoError] = useState('');
  const videoRef = useRef(null);

  // Workout timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef(null);

  // Validation constraints
  const HEIGHT_MIN = 50;
  const HEIGHT_MAX = 250;
  const WEIGHT_MIN = 20;
  const WEIGHT_MAX = 300;

  // Effect to apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Webcam stream logic
  useEffect(() => {
    const getVideo = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        } catch (err) {
          setVideoError("Unable to access webcam.");
        }
      }
    };
    getVideo();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Timer effect for start/pause functionality
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerActive]);

  // Theme toggler (light/dark)
  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Controlled input for height validation
  const handleHeightChange = (e) => {
    const value = e.target.value;
    setHeight(value);
    if (value === '') {
      setHeightError('Height is required.');
    } else {
      const num = Number(value);
      if (isNaN(num)) setHeightError('Height must be a number.');
      else if (num < HEIGHT_MIN || num > HEIGHT_MAX)
        setHeightError(`Height must be between ${HEIGHT_MIN} and ${HEIGHT_MAX} cm.`);
      else setHeightError('');
    }
  };

  // Controlled input for weight validation
  const handleWeightChange = (e) => {
    const value = e.target.value;
    setWeight(value);
    if (value === '') {
      setWeightError('Weight is required.');
    } else {
      const num = Number(value);
      if (isNaN(num)) setWeightError('Weight must be a number.');
      else if (num < WEIGHT_MIN || num > WEIGHT_MAX)
        setWeightError(`Weight must be between ${WEIGHT_MIN} and ${WEIGHT_MAX} kg.`);
      else setWeightError('');
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Returns a personalized exercise recommendation string based on height and weight.
   * Basic ruleset:
   *  - BMI < 18.5: focus on bodyweight strength, no excessive cardio
   *  - BMI 18.5-25: balanced (push-ups, squats, plank)
   *  - BMI 25-30: start with mix of strength & light cardio
   *  - BMI > 30: prioritize low-impact, high-rep, safety
   */
  const getRecommendations = () => {
    if (!height || !weight || heightError || weightError) {
      return "Fill in your height & weight for recommendations.";
    }
    const h = Number(height);
    const w = Number(weight);
    if (
      isNaN(h) ||
      isNaN(w) ||
      h < HEIGHT_MIN ||
      h > HEIGHT_MAX ||
      w < WEIGHT_MIN ||
      w > WEIGHT_MAX
    ) {
      return "Enter valid height & weight for recommendations.";
    }
    const bmi = w / ((h / 100) ** 2);
    let exercises;
    if (bmi < 18.5) {
      exercises = [
        "12 Push-Ups",
        "18 Squats",
        "30-sec Plank",
        "Light Yoga/Stretching"
      ];
      return (
        <>
          <strong>Goal:</strong> Build Strength & Mass<br />
          {exercises.map((ex, idx) => (<div key={idx}>• {ex}</div>))}
        </>
      );
    } else if (bmi < 25) {
      exercises = [
        "15 Push-Ups",
        "20 Squats",
        "40-sec Plank",
        "15 Jumping Jacks"
      ];
      return (
        <>
          <strong>Goal:</strong> Balanced Fitness<br />
          {exercises.map((ex, idx) => (<div key={idx}>• {ex}</div>))}
        </>
      );
    } else if (bmi < 30) {
      exercises = [
        "10 Push-Ups",
        "16 Squats",
        "25-sec Plank",
        "20 Low-Impact Step-Ups",
        "30-sec Fast Walk in Place"
      ];
      return (
        <>
          <strong>Goal:</strong> Mix Cardio & Strength<br />
          {exercises.map((ex, idx) => (<div key={idx}>• {ex}</div>))}
        </>
      );
    } else {
      exercises = [
        "8 Chair Squats",
        "20-sec Wall Push-Ups",
        "40-sec Standing March",
        "30-sec Seated Knee Raises"
      ];
      return (
        <>
          <strong>Goal:</strong> Focus on Low-Impact, Safe Movements<br />
          {exercises.map((ex, idx) => (<div key={idx}>• {ex}</div>))}
        </>
      );
    }
  };

  // Prevent submit for now, enable in future if form is used for more
  // PUBLIC_INTERFACE
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  // PUBLIC_INTERFACE
  /**
   * Formats seconds to MM:SS (example: 08:47 for 8 min 47 sec)
   */
  const formatTime = (totalSeconds) => {
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // PUBLIC_INTERFACE
  /**
   * Start the workout timer
   */
  const handleTimerStart = () => setTimerActive(true);

  // PUBLIC_INTERFACE
  /**
   * Pause the workout timer
   */
  const handleTimerPause = () => setTimerActive(false);

  // PUBLIC_INTERFACE
  /**
   * Reset the workout timer to zero
   */
  const handleTimerReset = () => {
    setTimerActive(false);
    setTimerSeconds(0);
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <div className="main-layout">
        {/* Centered Input Form */}
        <div className="form-section">
          <h2 className="section-title">Enter Your Details</h2>
          <form className="input-form" onSubmit={handleFormSubmit} noValidate>
            <label>
              Height (cm)
              <input
                type="number"
                min={HEIGHT_MIN}
                max={HEIGHT_MAX}
                inputMode="numeric"
                value={height}
                onChange={handleHeightChange}
                placeholder="e.g. 170"
                required
                aria-invalid={!!heightError}
                aria-describedby="height-error"
              />
              {heightError && (
                <span style={{ color: "#c43d4a", fontSize: "0.96em", marginTop: "2px" }} id="height-error" role="alert">
                  {heightError}
                </span>
              )}
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                min={WEIGHT_MIN}
                max={WEIGHT_MAX}
                inputMode="numeric"
                value={weight}
                onChange={handleWeightChange}
                placeholder="e.g. 65"
                required
                aria-invalid={!!weightError}
                aria-describedby="weight-error"
              />
              {weightError && (
                <span style={{ color: "#c43d4a", fontSize: "0.96em", marginTop: "2px" }} id="weight-error" role="alert">
                  {weightError}
                </span>
              )}
            </label>
          </form>
        </div>
        {/* Side Panel: Recommendations & Timer */}
        <div className="side-panel">
          <div className="recommendations">
            <h3>Exercise Recommendations</h3>
            <div className="recommendation-list">
              {getRecommendations()}
            </div>
          </div>
          <div className="workout-timer">
            <h3>Workout Timer</h3>
            {/* Inline workout timer UI using App-level state and handlers */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem" }}>
              <span className="timer-placeholder" aria-live="polite" aria-atomic="true">
                {formatTime(timerSeconds)}
              </span>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <button
                  className="btn"
                  style={{
                    background: "var(--button-bg)",
                    color: "var(--button-text)",
                    border: "none",
                    borderRadius: "7px",
                    padding: "8px 18px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    fontSize: "15px",
                    cursor: timerActive ? "not-allowed" : "pointer",
                    opacity: timerActive ? 0.7 : 1
                  }}
                  onClick={handleTimerStart}
                  disabled={timerActive}
                  aria-label="Start timer"
                  type="button"
                >
                  Start
                </button>
                <button
                  className="btn"
                  style={{
                    background: "#ddd",
                    color: "#222",
                    border: "none",
                    borderRadius: "7px",
                    padding: "8px 18px",
                    fontWeight: 550,
                    fontSize: "15px",
                    cursor: timerActive ? "pointer" : "not-allowed",
                    opacity: timerActive ? 1 : 0.75
                  }}
                  onClick={handleTimerPause}
                  disabled={!timerActive}
                  aria-label="Pause timer"
                  type="button"
                >
                  Pause
                </button>
                <button
                  className="btn"
                  style={{
                    background: "#e9ecef",
                    color: "#444",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                    padding: "8px 18px",
                    fontWeight: 500,
                    fontSize: "15px",
                    cursor: "pointer"
                  }}
                  onClick={handleTimerReset}
                  aria-label="Reset timer"
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Webcam Display */}
        <div className="webcam-section">
          <div className="webcam-header">
            <h2>Your Workout Video</h2>
          </div>
          <div className="webcam-container">
            <video
              ref={videoRef}
              className="webcam-video"
              autoPlay
              playsInline
              muted
              aria-label="Webcam Video Feed"
            />
            {videoError && (
              <div className="webcam-error">{videoError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
