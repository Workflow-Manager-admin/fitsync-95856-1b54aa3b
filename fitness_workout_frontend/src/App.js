import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  // Height and weight are stored as strings for controlled inputs
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  // Validation error states
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [videoError, setVideoError] = useState('');
  const videoRef = useRef(null);

  // Validation constraints
  const HEIGHT_MIN = 50;
  const HEIGHT_MAX = 250;
  const WEIGHT_MIN = 20;
  const WEIGHT_MAX = 300;

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

  // Validate height on change
  const handleHeightChange = (e) => {
    const value = e.target.value;
    setHeight(value);

    if (value === '') {
      setHeightError('Height is required.');
    } else {
      const num = Number(value);
      if (isNaN(num)) {
        setHeightError('Height must be a number.');
      } else if (num < HEIGHT_MIN || num > HEIGHT_MAX) {
        setHeightError(`Height must be between ${HEIGHT_MIN} and ${HEIGHT_MAX} cm.`);
      } else {
        setHeightError('');
      }
    }
  };

  // Validate weight on change
  const handleWeightChange = (e) => {
    const value = e.target.value;
    setWeight(value);

    if (value === '') {
      setWeightError('Weight is required.');
    } else {
      const num = Number(value);
      if (isNaN(num)) {
        setWeightError('Weight must be a number.');
      } else if (num < WEIGHT_MIN || num > WEIGHT_MAX) {
        setWeightError(`Weight must be between ${WEIGHT_MIN} and ${WEIGHT_MAX} kg.`);
      } else {
        setWeightError('');
      }
    }
  };

  // Recommendations respond to validation or required fields
  // PUBLIC_INTERFACE
  const getRecommendations = () => {
    if (!height || !weight || heightError || weightError) {
      return "Fill in your height & weight for recommendations.";
    }
    // Demo logic for exercise recommendation (to be replaced)
    return "Recommended: 10 Push-Ups, 15 Squats, 20-sec Plank";
  };

  // PUBLIC_INTERFACE
  // Submit can be added in the future, for now, block submit (preventDefault)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Optionally perform validation here if submit is added later
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
