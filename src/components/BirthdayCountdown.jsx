
// src/components/BirthdayCountdown.jsx
import React, { useState, useEffect } from "react";

const BirthdayCountdown = () => {
  const calculateTimeLeft = () => {
    const birthday = new Date("2025-12-07T00:00:00"); // Birthday date
    const now = new Date();
    const difference = birthday - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <h2>Countdown to My Birthday 🎉</h2>
      <div className="countdown-timer">
        {Object.keys(timeLeft).length > 0 ? (
          <>
            <span>{timeLeft.days}d</span> :
            <span>{timeLeft.hours}h</span> :
            <span>{timeLeft.minutes}m</span> :
            <span>{timeLeft.seconds}s</span>
          </>
        ) : (
          <span>🎉 Happy Birthday! 🎉</span>
        )}
      </div>
    </div>
  );
};

export default BirthdayCountdown;
