import React, { useEffect, useRef, useState } from 'react';

const Counter = ({ targetNumber = 1000, duration = 2000, title = "People We've Worked With" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounter();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 } // trigger when 50% is visible
    );

    if (counterRef.current) observer.observe(counterRef.current);

    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, [hasAnimated]);

  const animateCounter = () => {
    let start = 0;
    const end = targetNumber;
    const incrementTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
  };

  return (
    <div ref={counterRef} style={styles.container}>
      <h2 style={styles.number}>{count}+</h2>
      <p style={styles.title}>{title}</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f7f7f7',
    borderRadius: '10px',
    width: 'fit-content',
    margin: '4rem auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  number: {
    fontSize: '3rem',
    margin: 0,
    color: '#333',
  },
  title: {
    marginTop: '0.5rem',
    fontSize: '1.2rem',
    color: '#666',
  },
};

export default Counter;
