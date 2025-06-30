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
    if (isNaN(h) || isNaN(w) || h < HEIGHT_MIN || h > HEIGHT_MAX || w < WEIGHT_MIN || w > WEIGHT_MAX) {
      return "Enter valid height & weight for recommendations.";
    }
    // Calculate BMI: weight (kg) / (height (m))^2
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
    } else if (bmi >= 18.5 && bmi < 25) {
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
    } else if (bmi >= 25 && bmi < 30) {
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
