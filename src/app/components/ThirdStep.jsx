"use client";
import React from "react";
import styles from "./ThirdStep.module.css";
import Image from "next/image";
import { trainers } from "@/app/trainers/dat";

const ThirdStep = ({ selectedData, onNext }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.stepHeader}>
          <div className={styles.roundNumber}>03</div>
          <div className={styles.stepNumber}>CHOOSE YOUR TRAINER</div>
        </div>
        <p className={styles.descriptionText}>
          Choose your perfect partner! Our expert trainers at Shaped are
          handpicked to match your fitness goals. Find the trainer who aligns
          with your needs and start your journey today.
        </p>
      </div>
      <div className={styles.rightColumn}>
        {trainers.map((trainer, index) => (
          <div key={index} className={styles.trainerCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={trainer.image}
                alt={trainer.name}
                layout="responsive"
                width={200}
                height={100}
                objectFit="cover"
              />
            </div>
            <div className={styles.trainerInfo}>
              <h3 className={styles.trainerName}>{trainer.name}</h3>
              <p className={styles.description}>{trainer.description}</p>
              <button
                className={styles.selectButton}
                onClick={() => onNext(trainer)}
              >
                select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThirdStep;
