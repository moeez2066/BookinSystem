import React, { useEffect, useState } from "react";
import styles from "./FourthStep.module.css";
import CalendarComponent from "./CalendarComponent";
import MapComponent from "./MapComponent";

const FourthStep = ({ data, sessionPackage }) => {
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, []);
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setShowCalendar(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.stepHeader}>
          <div className={styles.roundNumber}>04</div>
          <div className={styles.stepNumber}>SCHEDULE YOUR SESSIONS</div>
        </div>
        <p className={styles.descriptionText}>
          Choose the days and times that suit you from our trainers'
          availability. We'll confirm your schedule so you can start working
          towards your fitness goals.
        </p>
      </div>
      <div className={styles.rightColumn}>
        {!showCalendar ? (
          <MapComponent
            showCalendar={showCalendar}
            toggleCalendar={toggleCalendar}
          />
        ) : (
          <CalendarComponent data={data} sessionPackage={sessionPackage} />
        )}
      </div>
    </div>
  );
};

export default FourthStep;
