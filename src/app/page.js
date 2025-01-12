"use client";
import React from "react";
import styles from "./home.module.css";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div>
        <div className={styles.container}>
          <div
            className={styles.rightColumn}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src="/empowering.jpg"
                alt="General Fitness"
                layout="responsive"
                width={400}
                height={400}
                objectFit="cover"
                style={{ transform: "scaleX(-1)" }} // Mirrors the image horizontally
              />
            </div>
          </div>
        </div>
        <div
          className={styles.container}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <h1 className={styles.title} style={{ textAlign: "center" }}>
            empowering every body
          </h1>
        </div>
        <div className="flex  flex-col items-center justify-center text-center px-6 py-12 pt-8 sm:pt-0 sm:-mt-[122px] -mt-[100px] bg-white">
          <h1 className="sm:text-[40px] Manrope text-[22px] sm:w-[530px] w-[300px] sm:leading-[60px] leading-9 font-semibold text-[#473a3a]">
            Discover the ease of workouts that come to you.
          </h1>
          <p className="mt-4 sm:w-[371px] Helvetica text-[#473a3a] text-sm md:text-base lg:text-lg max-w-4xl">
            With personalized sessions, we create a space where your fitness
            journey feels natural, inspired, and uniquely yours.
          </p>
          <Link href={"/book"}>
            <button className={styles.selectButton}>book now</button>
          </Link>
        </div>

        <div className="bg-[#efede9] mt-10 flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-[1133px] py-0 mx-auto  flex flex-col lg:flex-row items-center justify-center  gap-8  px-6 lg:px-16">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center my-auto pt-9 sm:pt-0 lg:text-left pr-0 lg:pr-[185px]">
              <h2
                className="text-[49px] lg:text-[68px] text-[#473a3a]"
                style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
              >
                about us
              </h2>
              <p className="text-[#473a3a] text-[14px] Helvetica">
                At Shaped, a proud Saudi brand based in Riyadh, we believe that
                fitness should be as personal as it is empowering. That’s why we
                bring the gym to you— whether in your living room, home gym, or
                outdoor space—tailoring each session to your unique goals and
                lifestyle. Our carefully selected trainers are experts in their
                fields, specializing in everything from general fitness and
                bodybuilding to Pilates and yoga.
              </p>
              <button className={styles.selectButton}>Learn More</button>
            </div>

            {/* Right Content */}
            <div className="relative pb-12 sm:pb-0 flex ">
              <p
                className="bg-[#baada6] text-center text-white p-3  text-nowrap h:[90vh]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  width: "53px",
                }}
              >
                <p className="transform rotate-90 Helvetica ">
                  EMPOWERING EVERY BODY
                </p>
              </p>
              <div className="relative lg:w-[450px] lg:h-[90vh]">
                <img
                  src="/empowering.jpg"
                  alt="Empowering Every Body"
                  width={450}
                  height={450}
                  objectFit="cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative h-[444px]  bg-top sm:h-[646px] w-full bg-cover lg:bg-top"
          style={{
            backgroundImage: "url('/quote.jpg')", // Replace with your image path
          }}
        >
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center">
            {/* Quote Text */}
            <h1
              className="text-white text-5xl lg:text-[120px] mb-5 text-center"
              style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
            >
              “quote goes here”
            </h1>

            {/* Small Image Below Text */}
            <div className="mt-6">
              <img
                src="/brand.png" // Replace with the small image path
                alt="small decorative image"
                className="sm:w-20 -mb-14 w-14 h-14  sm:h-20"
              />
            </div>
          </div>
        </div>
        <div className="bg-[#efede9] py-12 px-4 sm:px-6">
          {/* Heading Section */}
          <div className="text-center mb-12">
            <h2
              className="text-5xl sm:text-5xl lg:text-[68px] text-[#473a3a]"
              style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
            >
              meet our trainers
            </h2>
            <p className="text-[#473a3a] Helvetica text-sm mt-3 sm:text-base max-w-[550px] mx-auto px-4 sm:px-0">
              At Shaped, our trainers are the heart of our personalized fitness
              experience. Each of our dedicated professionals brings a wealth of
              expertise and a passion for helping you achieve your goals.
            </p>
          </div>

          {/* Trainers Section */}
          <div className="max-w-[866px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-0">
            {/* Trainer Card */}
            {[
              {
                img: "/general-fitness.jpg",
                name: "TRAINER NAME",
                description:
                  "Specializing in [specialty, e.g., general fitness, bodybuilding], [Trainer Name] combines years of experience with a personalized approach to create effective and engaging workouts tailored to your needs.",
              },
              {
                img: "/pilates.jpg",
                name: "TRAINER NAME",
                description:
                  "With a focus on [specialty, e.g., Pilates, Yoga], [Trainer Name] offers a supportive and motivating environment, helping you enhance flexibility and strength while promoting overall wellness.",
              },
              {
                img: "/trainer3.jpg",
                name: "TRAINER NAME",
                description:
                  "Expert in [specialty, e.g., kickboxing, CrossFit], [Trainer Name] delivers dynamic and challenging sessions designed to push your limits and elevate your performance.",
              },
            ].map((trainer, index) => (
              <div key={index} className="flex flex-col">
                <img
                  src={trainer.img}
                  alt={trainer.name}
                  className="w-full h-[200px] sm:h-[340px] object-cover"
                />
                <div className="text-center relative h-[213px] flex flex-col">
                  <h3 className="my-3 mt-5 font-bold text-[#473a3a] uppercase Manrope">
                    {trainer.name}
                  </h3>
                  <p className="text-[#473a3a] text-[13px] px-4 sm:px-2 Helvetica">
                    {trainer.description}
                  </p>
                  <button
                    className={`${styles.selectButton} absolute bottom-0 left-1/2 transform -translate-x-1/2 `}
                  >
                    book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#414144ff] text-white p-8 pt-0 sm:pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-center">
            {/* Side title - Hidden on mobile, visible on desktop */}
            <div
              style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
              className="text-[206px] hidden lg:block lg:w-1/4 tracking-widest -rotate-90 transform mt-[295px] mr-28"
            >
              services
            </div>

            {/* Mobile title - Visible on mobile, hidden on desktop */}
            <div
              style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
              className="text-[100px] lg:hidden "
            >
              services
            </div>

            {/* Service Cards */}
            <div className="w-full lg:w-[530px] grid gap-8 my-8 mt-3 sm:mt-8">
              {[
                {
                  title: "CUSTOMIZED PERSONAL TRAINING",
                  description:
                    "Personalized workouts in general fitness, bodybuilding, kickboxing, CrossFit, Pilates, and Yoga tailored to your goals.",
                  image: "/service.jpg",
                },
                {
                  title: "NUTRITIONAL GUIDANCE",
                  description:
                    "Expert advice to support your fitness journey and help you achieve lasting results.",
                  image: "/general-fitness.jpg",
                },
                {
                  title: "WORKOUT ESSENTIALS",
                  description:
                    "We provide high-quality workout equipment, ensuring you have everything you need to train effectively at home.",
                  image: "/service.jpg",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row items-center lg:items-start"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={700}
                    height={170}
                    className="w-full lg:w-[700px] max-h-[170px] object-cover"
                  />
                  <div className="lg:ml-8 mt-4 lg:mt-0 text-center lg:text-left">
                    <h3 className="font-semibold Manrope">{service.title}</h3>
                    <p className="text-[13px] sm:w-[255px] Helvetica mt-2 lg:pr-14 px-4 lg:px-0">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white py-28 px-4 sm:px-0">
          {/* Heading */}
          <h1 className="text-3xl Manrope  text-[#473a3a] md:text-5xl font-semibold text-center px-4 sm:px-0">
            book your{" "}
            <span
              className="text-5xl md:text-7xl font-normal text-[#473a3a]"
              style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
            >
              free
            </span>{" "}
            consultation
          </h1>

          {/* Description */}
          <p className="mt-4 w-full Helvetica sm:w-[394px] text-center text-[#473a3a] text-base md:text-lg max-w-xl px-6 sm:px-0">
            Experience a complimentary 40-minute session to explore the basics
            of different workouts and get acquainted with our specialized
            equipment. All fitness levels are welcome.
          </p>

          {/* Button */}
          <Link href="/book">
            <button className={styles.selectButton}>book now</button>
          </Link>
        </div>
      </div>
    </>
  );
}
