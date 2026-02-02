import React, { useState, useEffect } from "react";
import "./CountdownTimer.css";

const CountdownTimer = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      // Flash sale ends at midnight tomorrow
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 7);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-timer">
      <div className="countdown-box">
        <h3 className="countdown-title">⚡ FLASH SALE</h3>
        <p className="countdown-subtitle">Ends in:</p>
        <div className="countdown-display">
          <div className="time-unit">
            <span className="time-value">{String(time.days).padStart(2, "0")}</span>
            <span className="time-label">Days</span>
          </div>
          <div className="separator">:</div>
          <div className="time-unit">
            <span className="time-value">{String(time.hours).padStart(2, "0")}</span>
            <span className="time-label">Hours</span>
          </div>
          <div className="separator">:</div>
          <div className="time-unit">
            <span className="time-value">{String(time.minutes).padStart(2, "0")}</span>
            <span className="time-label">Mins</span>
          </div>
          <div className="separator">:</div>
          <div className="time-unit">
            <span className="time-value">{String(time.seconds).padStart(2, "0")}</span>
            <span className="time-label">Secs</span>
          </div>
        </div>
        <p className="countdown-discount">Get Up to 50% OFF</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
