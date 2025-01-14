export const trainers = [
  {
    _id: "673cc732bb6e84489791b053",
    name: "Iasmin",
    description:
      "Specializing in [specialty, e.g., general fitness, bodybuilding],[Trainer Name] combines years of experience with a personalized approach to create effective and engaging workouts tailored to your needs.",
    image: "/pilates.jpg",
  },
  {
    _id: "6739dd5ec785a7965d4370cb",
    name: "Patricia",
    description:
      "With a focus on [specialty, e.g., Pilates, Yoga],[Trainer Name] offers a supportive and motivating environment, helping you enhance flexibility and strength while promoting overall wellness.",
    image: "/general-fitness.jpg",
  },
];

export const pilates = [
  {
    _id: "673cc6e1b6e84489791b051",
    name: "trainer1",
    description:
      "Specializing in [specialty, e.g., general fitness, bodybuilding],[Trainer Name] combines years of experience with a personalized approach to create effective and engaging workouts tailored to your needs.",
    image: "/pilates.jpg",
  },
  {
    _id: "67316f84ca5ca2676850b1e",
    name: "trainer2",
    description:
      "With a focus on [specialty, e.g., Pilates, Yoga],[Trainer Name] offers a supportive and motivating environment, helping you enhance flexibility and strength while promoting overall wellness.",
    image: "/general-fitness.jpg",
  },
];
export const parseValidity = (validity, startDate) => {
  const start = new Date(startDate); // Parse the starting date
  let endDate;

  if (validity.includes("weeks")) {
    const weeks = parseInt(validity.split(" ")[0], 10); // Extract number of weeks
    endDate = new Date(start);
    endDate.setDate(start.getDate() + weeks * 7); // Add weeks
  } else if (validity.includes("months")) {
    const months = parseInt(validity.split(" ")[0], 10); // Extract number of months
    endDate = new Date(start);
    endDate.setMonth(start.getMonth() + months); // Add months
  }

  return {
    valid_start_date: start.toISOString(),
    valid_end_date: endDate.toISOString(),
  };
};
