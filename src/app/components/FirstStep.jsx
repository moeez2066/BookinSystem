import React from "react";
import Image from "next/image";
import styles from "./FirstStep.module.css";

const FirstStep = ({ onNext }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1 className={styles.title}>Packages</h1>
        <div className={styles.stepDescription}>
          <div className="flex items-center justify-center">
            <div className={styles.roundNumber}>01</div>
            <div className={styles.stepNumber}>CHOOSE YOUR SPECIALTY</div>
          </div>
          <p className={styles.descriptionText}>
            At Shaped, we offer a range of packages tailored to different
            training specialties and group sizes. To ensure you find the right
            fit for your fitness journey, please start by selecting your
            preferred specialty.
          </p>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div
          className={styles.packageCard}
          onClick={() => onNext("General Fitness")}
        >
          <div className={styles.imageWrapper}>
            <Image
              src="/general-fitness.jpg"
              alt="General Fitness"
              layout="responsive"
              width={200}
              height={100}
              objectFit="cover"
            />
          </div>
          <div className={styles.packageInfo}>
            <h2 className={styles.packageTitle}>GENERAL FITNESS</h2>
            <p className={styles.packageDescription}>
              Includes weight loss, bodybuilding, CrossFit, and kickboxing.
            </p>
            <button className={styles.selectButton}>select</button>
          </div>
        </div>
        <div className={styles.packageCard} onClick={() => onNext("Pilates")}>
          <div className={styles.imageWrapper}>
            <Image
              src="/pilates.jpg"
              alt="Pilates"
              layout="responsive"
              width={100}
              height={100}
              objectFit="cover"
            />
          </div>
          <div className={styles.packageInfo}>
            <h2 className={styles.packageTitle}>PILATES</h2>
            <p className={styles.packageDescription}>
              Features Reformer Pilates and Mat
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pilates.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
            <button className={styles.selectButton}>select</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
