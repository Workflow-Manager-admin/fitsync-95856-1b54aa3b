import React from "react";
import "./Navbar.css";

// PUBLIC_INTERFACE
/**
 * Navbar with project title and modern health-themed plus sign logo.
 * Responsive, minimal, and styled per app's color palette.
 */
function Navbar() {
  return (
    <nav className="fitness-navbar" role="navigation">
      <div className="fitness-navbar__content">
        <div className="fitness-navbar__logo-title">
          <span className="fitness-navbar__logo" aria-label="Health Plus Logo">
            {/* Modern, minimal health plus sign SVG */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                x="17"
                y="6"
                width="6"
                height="28"
                rx="3"
                fill="var(--accent-color, #2196f3)"
                />
              <rect
                x="6"
                y="17"
                width="28"
                height="6"
                rx="3"
                fill="var(--accent-color, #2196f3)"
                />
              {/* Optional: thin outline for modernity */}
              <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="10"
                stroke="var(--secondary-color, #938c85)"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </span>
          <span className="fitness-navbar__title">
            FitSync
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
