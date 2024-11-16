"use client";
import React, { useEffect, useState } from "react";
import styles from "./SecondStep.module.css";
import { packages } from "../sessions/dat";

const SecondStep = ({ selectedSpecialty, onNext }) => {
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const [activePackage, setActivePackage] = useState(null);

  const togglePackage = (index) => {
    setActivePackage(activePackage === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.stepHeader}>
          <div className={styles.roundNumber}>02</div>
          <div className={styles.stepNumber}>CHOOSE YOUR PACKAGE</div>
        </div>
        <p className={styles.descriptionText}>
          Explore our flexible training packages tailored to different group
          sizes and needs. Each package offers great value and is designed to
          fit your fitness goals.
        </p>
      </div>
      <div className={styles.rightColumn}>
        {packages.map((pkg, index) => (
          <div key={index}>
            <div
              className={`${styles.packageOption} ${
                index % 2 === 0 ? styles.alternate1 : styles.alternate2
              }`}
              onClick={() => togglePackage(index)}
            >
              <span>{pkg.name}</span>
              {activePackage === index ? (
                <svg
                  aria-hidden="true"
                  className={styles.arrowIcon}
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className={styles.arrowIcon}
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                </svg>
              )}
            </div>
            {activePackage === index && (
              <div className={`${styles.showSessions} `}>
                {pkg.sessions.map((session, i) => (
                  <div key={i} className={styles.sessionCard}>
                    <h3 className={styles.sessionTitle}>
                      {session.count} SESSIONS
                    </h3>
                    <div className={styles.price}>{session.price}</div>
                    <p className={styles.sessionDescription}>
                      valid: {session.validity}
                      <br />
                      {session.rate}
                    </p>
                    <button
                      className={styles.selectButton}
                      onClick={() => {
                        onNext({ name: pkg.name, ...session });
                        window.scrollTo({
                          top: document.documentElement.scrollHeight,
                          behavior: "smooth",
                        });
                      }}
                    >
                      select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondStep;
