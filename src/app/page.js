"use client";
import React, { useEffect, useState } from "react";
import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import ThirdStep from "./components/ThirdStep";
import FourthStep from "./components/FourthStep";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-data");
      const json = await res.json();
      console.log(4);
      
      console.log(json);
      console.log(44);
      
    };
    fetchData();
  }, []);
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
    setStep(4);
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
