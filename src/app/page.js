"use client";
import React, { useState } from "react";
import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import ThirdStep from "./components/ThirdStep";
import FourthStep from "./components/FourthStep";

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const goToNextStep = (specialty) => {
    setSelectedSpecialty(specialty);
    setStep(2);
  };

  const handlePackageSelection = (pkg) => {
    setSelectedPackage(pkg);
    setStep(3);
  };

  const handleTrainerSelection = (trainer) => {
    setSelectedTrainer(trainer);
    setStep(4); // Assuming you want a fourth step or summary view
  };

  return (
    <>
      {step >= 1 && (
        <FirstStep onNext={(specialty) => goToNextStep(specialty)} />
      )}
      {step >= 2 && (
        <SecondStep
          selectedSpecialty={selectedSpecialty}
          onNext={(pkg) => handlePackageSelection(pkg)}
        />
      )}
      {step >= 3 && (
        <ThirdStep
          selectedData={{ selectedSpecialty, selectedPackage }}
          onNext={(trainer) => handleTrainerSelection(trainer)}
        />
      )}
      {step >= 4 && (
        <FourthStep
          selectedData={{ selectedSpecialty, selectedPackage }}
          onNext={(trainer) => handleTrainerSelection(trainer)}
        />
      )}
    </>
  );
}
