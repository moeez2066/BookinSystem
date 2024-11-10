import React from "react";
import styles from "./FourthStep.module.css";
import CalendarComponent from "./CalendarComponent";

const FourthStep = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.stepHeader}>
          <div className={styles.roundNumber}>04</div>
          <div className={styles.stepNumber}>SCHEDULE YOUR SESSIONS</div>
        </div>
        <p className={styles.descriptionText}>
          Choose the days and times that suit you from our trainers' availability. We'll confirm your schedule so you can start working towards your fitness goals.
        </p>
        
      </div>
      <div className={styles.rightColumn}>
        {/* <CalendarComponent /> */}
      </div>
    </div>
  );
};

export default FourthStep;
