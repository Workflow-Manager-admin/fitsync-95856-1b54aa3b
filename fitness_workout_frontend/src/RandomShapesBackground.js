import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * Renders a set of randomly placed and colored subtle SVG decorative shapes in the app background.
 * Shapes use the app palette (primary, secondary, accent), soft blur, subtle opacity, and minimal animation.
 * Shapes are purposely non-interactive, fixed to viewport, and always placed behind all app content.
 */
function randomInt(min, max) {
  // Returns a random integer between min and max, inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// SVG shape generators
function SvgCircle({ cx, cy, r, color, opacity, blur }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      opacity={opacity}
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transition: "opacity 1.1s",
      }}
    />
  );
}
function SvgPolygon({ points, color, opacity, blur }) {
  return (
    <polygon
      points={points}
      fill={color}
      opacity={opacity}
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transition: "opacity 1.1s",
      }}
    />
  );
}
// Abstract "blob" via SVG path - soft/round, randomizes a bit but always organic
function SvgBlob({ path, color, opacity, blur }) {
  return (
    <path
      d={path}
      fill={color}
      opacity={opacity}
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transition: "opacity 1.2s",
      }}
    />
  );
}

// Blob path generator: returns SVG path string for random organic blob
function generateBlobPath(x, y, size, seed) {
  // Deterministic but random-like (so each load is reproducible, but shape is unique per shape).
  // We'll use some sine/cosine warping to make a "blobby" shape.
  let p = [];
  let points = 8 + (seed % 3); // 8–10 "lobes"
  for (let i = 0; i < points; ++i) {
    // angle
    let angle = (Math.PI * 2 * i) / points;
    let rmod =
      size *
      (0.7 +
        0.3 *
          Math.sin(
            angle * (0.5 + (seed % 4) / 10) +
              Math.cos(seed * 11 + angle * (seed % 8))
          ));
    let px = x + Math.cos(angle) * rmod;
    let py = y + Math.sin(angle) * rmod;
    p.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }
  p.push("Z");
  return p.join("");
}

const COLOR_PALETTE = [
  "var(--accent-color)", // now resolves to #2196f3
  "var(--secondary-color)",
  "var(--primary-color)",
];
const OPACITIES = [0.12, 0.19, 0.15, 0.10];
const BLURS = [38, 54, 23];

function generateRandomShape(viewW, viewH, key) {
  // Decide which shape type
  const shapeType = randomFrom(["circle", "polygon", "blob"]);
  const color = randomFrom(COLOR_PALETTE);
  const opacity = randomFrom(OPACITIES);

  let left = randomFloat(0.05, 0.85) * viewW;
  let top = randomFloat(0.08, 0.75) * viewH;
  let blur = randomFrom(BLURS);

  if (shapeType === "circle") {
    let r = randomInt(34, 110);
    return (
      <SvgCircle
        key={key}
        cx={left}
        cy={top}
        r={r}
        blur={blur}
        color={color}
        opacity={opacity}
      />
    );
  } else if (shapeType === "polygon") {
    // Soft polygon
    const num = randomInt(4, 7);
    const rad = randomInt(42, 85);
    let pts = [];
    for (let i = 0; i < num; ++i) {
      let angle = ((Math.PI * 2) / num) * i + randomFloat(-0.2, 0.2);
      let pr = rad * (0.93 + Math.random() * 0.11);
      pts.push(
        `${Math.round(left + Math.cos(angle) * pr)},${Math.round(
          top + Math.sin(angle) * pr
        )}`
      );
    }
    return (
      <SvgPolygon
        key={key}
        points={pts.join(" ")}
        blur={blur}
        color={color}
        opacity={opacity}
      />
    );
  } else {
    // blob
    let s = randomInt(42, 85);
    let path = generateBlobPath(left, top, s, key * 1007);
    return (
      <SvgBlob
        key={key}
        path={path}
        blur={blur}
        color={color}
        opacity={opacity}
      />
    );
  }
}

function RandomShapesBackground() {
  // Calculate viewport size once on mount for shape random placement
  const [viewSize, setViewSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    function handleResize() {
      setViewSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize random shapes on mount or when viewport size changes
  const shapes = useMemo(() => {
    // More shapes on big screens, fewer on small
    const baseNum = viewSize.width < 700 ? 3 : viewSize.width < 1100 ? 6 : 10;
    return Array.from({ length: baseNum }, (_, idx) =>
      generateRandomShape(viewSize.width, viewSize.height, idx + 1)
    );
  }, [viewSize]);

  return (
    <svg
      className="fitness-random-bg-shapes"
      width={viewSize.width}
      height={viewSize.height}
      viewBox={`0 0 ${viewSize.width} ${viewSize.height}`}
      style={{
        position: "fixed",
        zIndex: 0,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "visible",
        opacity: 0.34,
        transition: "opacity 1s",
        mixBlendMode: "lighten",
      }}
      aria-hidden="true"
      focusable="false"
    >
      {shapes}
    </svg>
  );
}

export default RandomShapesBackground;
