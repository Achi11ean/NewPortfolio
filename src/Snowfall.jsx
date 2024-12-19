import React, { useEffect } from "react";

const Snowfall = () => {
  useEffect(() => {
    const createSnowflakes = () => {
      const snowflakeContainer = document.getElementById("snowfall");
      if (!snowflakeContainer) return;

      for (let i = 0; i < 50; i++) { // Total snowflakes
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.innerHTML = "❄"; // Snowflake icon
        snowflake.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        snowflake.style.animationDelay = `${Math.random() * 10}s`; // Staggered animation
        snowflake.style.animationDuration = `${Math.random() * 8 + 4}s`; // Randomized fall speed
        snowflake.style.opacity = Math.random(); // Vary opacity for realism
        snowflake.style.fontSize = `${Math.random() * 1.5 + 0.5}rem`; // Random size

        snowflakeContainer.appendChild(snowflake);
      }
    };

    createSnowflakes();
  }, []);

  return <div id="snowfall" className="absolute inset-0 pointer-events-none"></div>;
};

export default Snowfall;
