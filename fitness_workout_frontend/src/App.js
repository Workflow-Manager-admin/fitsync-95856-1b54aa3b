import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [videoError, setVideoError] = useState('');
  const videoRef = useRef(null);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Access the webcam stream
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
      // Cleanup video stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Placeholder for recommendations and timer until further logic is added
  const getRecommendations = () => {
    if (!height || !weight) {
      return "Fill in your height & weight for recommendations.";
    }
    // Demo logic for exercise recommendation (to be replaced)
    return "Recommended: 10 Push-Ups, 15 Squats, 20-sec Plank";
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
          <form className="input-form" onSubmit={e => e.preventDefault()}>
            <label>
              Height (cm)
              <input
                type="number"
                min="50"
                max="250"
                inputMode="numeric"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 170"
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                min="20"
                max="300"
                inputMode="numeric"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 65"
              />
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
            {/* Timer logic to be added */}
            <p className="timer-placeholder">00:00</p>
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
