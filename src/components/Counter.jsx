import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaHandshake, FaLaptopCode } from "react-icons/fa";
import './Counter.css';

const statsData = [
  { label: "Students", target: 50, icon: <FaGraduationCap /> },
  { label: "Clients", target: 47, icon: <FaHandshake /> },
  { label: "Websites Developed", target: 11, icon: <FaLaptopCode /> },
];

function StatsCounter() {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasAnimated]);

  // Counting logic
  useEffect(() => {
    if (!hasAnimated) return;

    const intervals = statsData.map((stat, index) => {
      const step = stat.target / 60;
      return setInterval(() => {
        setCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[index] < stat.target) {
            newCounts[index] = Math.min(newCounts[index] + step, stat.target);
          }
          return newCounts;
        });
      }, 40);
    });

    return () => intervals.forEach(clearInterval);
  }, [hasAnimated]);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-header">
        <h2>Our Achievements</h2>
        <p>Proud milestones we’ve reached at Modern Computer World Uganda</p>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stats-card"
            initial={{ opacity: 0, y: 50 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.3 }}
          >
            <div className="stats-icon">{stat.icon}</div>
            <h3>{Math.round(counts[index])}+</h3>
            <p>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsCounter;
