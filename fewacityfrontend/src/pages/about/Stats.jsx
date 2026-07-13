import { useEffect, useRef } from 'react';
import './Stats.css';

const Stats = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2200; // SAME TIME FOR ALL (ms)
    const frameRate = 20;

    const startCounter = (counter) => {
      const target = +counter.dataset.target;
      const steps = animationDuration / frameRate;
      const increment = target / steps;
      let current = 0;

      const update = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.floor(current).toLocaleString();
          setTimeout(update, frameRate);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      update();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-container">
        <div className="stat-card">
          <span className="top-accent"></span>
          <div className="stat-icon">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <h2 className="counter" data-target="1150">0</h2>
          <p>Happy Patients</p>
        </div>

        <div className="stat-card">
          <span className="top-accent"></span>
          <div className="stat-icon">
            <i className="fa-solid fa-user-doctor"></i>
          </div>
          <h2 className="counter" data-target="60">0</h2>
          <p>Specialist Doctors</p>
        </div>

        <div className="stat-card">
          <span className="top-accent"></span>
          <div className="stat-icon">
            <i className="fa-solid fa-hospital"></i>
          </div>
          <h2 className="counter" data-target="30">0</h2>
          <p>Medical Services</p>
        </div>

        <div className="stat-card">
          <span className="top-accent"></span>
          <div className="stat-icon">
            <i className="fa-solid fa-hand-holding-medical"></i>
          </div>
          <h2 className="counter" data-target="150000">0</h2>
          <p>Problems Solved</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
