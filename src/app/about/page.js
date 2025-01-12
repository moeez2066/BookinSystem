"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "../components/FirstStep.module.css";
import Image from "next/image";

const faqs = [
  {
    question: "Can I reschedule my sessions?",
    answer:
      "Yes, you can reschedule your sessions through our website at least 24 hours before your scheduled time. For requests made within 24 hours, please contact your trainer directly via WhatsApp. Rescheduling is subject to trainer availability. Please note, all rescheduled sessions must be completed within the validity period of your package.",
  },
  {
    question: "Can I cancel my package and get a refund?",
    answer:
      "There are no cancellations or refunds for purchased packages. Once a package is bought, it must be completed within the designated validity period.",
  },
  {
    question: "What happens if I’m late to my session?",
    answer:
      "If you arrive late without prior notice, the time you’re late will be deducted from your session. Sessions will end at the originally scheduled time.",
  },
  {
    question: "What is the policy for no-shows?",
    answer:
      "If you do not attend a session without prior notice, the session will be cancelled, and no refund or rescheduling options will be provided.",
  },
  {
    question: "What if my trainer is late or doesn’t show to our appointment?",
    answer:
      "If your trainer is late, that time will be added to your session or carried over to a future session, depending on availability. If the trainer doesn’t show without prior notice, your session will be rescheduled, and you will receive one free session as compensation.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with "faqs" Text */}
      <div className="sm:h-[600px] h-[350px] bg-top flex items-center justify-center relative">
        {/* Background Image */}
        <Image
          src="/quote.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="top"
          className="z-0"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(65,65,65,0.74)] to-[rgba(0,0,0,0.5)] z-10" />

        {/* Text Content */}
        <h1
          className="text-[149px] lg:text-[348px] text-white z-20"
          style={{ fontFamily: '"Pinyon Script", Sans-serif' }}
        >
          faqs
        </h1>
      </div>
      <section className="bg-[#efede9] w-full py-14 sm:py-24 px-4 sm:px-0">
        {/* FAQ Section */}
        <div className="sm:w-[944px] w-full flex  flex-col sm:flex-row mx-auto py-16 px-4 ">
          <h2 className="Manrope text-[21px]  tracking-[0.26rem] pr-5 leading-10 text-[#473a3a] mb-12">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="sm:w-[544px] Helvetica text-justify">
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{ borderColor: "rgb(166 159 156)" }}
                className={`border-t-2  ${
                  index === faqs.length - 1 ? "border-b-2" : ""
                }`}
              >
                <button
                  className="w-full py-3 tracking-wide text-sm sm:text-base font-semibold flex justify-between items-center text-left"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="text-[#473a3a] Manrope">
                    {index + 1}. {faq.question}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#473a3a] border-[1px] rounded-full border-[#473a3a] transition-transform duration-200 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                    style={{
                      minWidth: "1.25rem", // Ensures consistent width
                      minHeight: "1.25rem", // Ensures consistent height
                    }}
                  />
                </button>

                {openIndex === index && (
                  <div className="pb-6 text-[#473a3a] sm:text-sm text-[13px]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex sm:w-[854px] py-24 flex-col items-center justify-center mx-auto">
        <h2 className="Manrope text-[21px] text-center font-semibold tracking-[0.26rem] sm:pr-5 leading-10 text-[#473a3a] mb-12">
          CANCELLATION AND
          <br />
          RESCHEDULING POLICY
        </h2>
        <div className="flex Helvetica flex-col items-center sm:items-stretch justify-center  sm:flex-row">
          <div
            className="sm:pr-12 pb-8 sm:pb-0 border-b-2 sm:border-b-0 mx-10 sm:mx-0 sm:w-[270px]  text-[#473a3a] "
            style={{ borderColor: "rgb(166 159 156)" }}
          >
            <div className="flex items-center ">
              <div
                className={styles.roundNumber}
                style={{ marginRight: "15px" }}
              >
                01
              </div>
              <div
                className={`${styles.stepNumber} ${styles.stepNumberr} tracking-widest`}
              >
                RESCHEDULING SESSIONS
              </div>
            </div>
            <p
              className={`${styles.descriptionText} ${styles.descriptionTextt}`}
            >
              Clients can reschedule their sessions directly through the website
              as long as the rescheduling is requested at least 24 hours before
              the scheduled session time.
              <br /> <br />
              If a rescheduling request is made within 24 hours of the session
              time, the client must contact their trainer directly. Rescheduling
              within this timeframe is based on the trainer's availability and
              is not guaranteed.
            </p>
          </div>{" "}
          <div
            className=" sm:pl-12 mx-10 sm:mx-0  sm:border-b-0 sm:mr-12 py-8 sm:py-0 border-b-2 sm:border-l-2  sm:w-[270px]  text-[#473a3a] "
            style={{ borderColor: "rgb(166 159 156)" }}
          >
            <div className="flex items-center">
              <div
                className={styles.roundNumber}
                style={{ marginRight: "15px" }}
              >
                02
              </div>
              <div
                className={`${styles.stepNumber} ${styles.stepNumberr}  tracking-widest`}
              >
                SESSION VALIDITY
              </div>
            </div>
            <p
              className={`${styles.descriptionText} ${styles.descriptionTextt}`}
            >
              All rescheduled sessions must be completed within the validity
              period of the purchased package. For example: A *10-session
              package* is valid for *5 weeks*. <br />
              <br />
              Any sessions not rescheduled or completed within this validity
              period will be *automatically cancelled and forfeited*.
            </p>
          </div>{" "}
          <div
            className="sm:pl-12  sm:w-[270px] pt-8 sm:pt-0  sm:border-l-2 px-10 sm:px-0   text-[#473a3a] "
            style={{ borderColor: "rgb(166 159 156)" }}
          >
            <div className="flex items-center">
              <div
                className={styles.roundNumber}
                style={{ marginRight: "15px" }}
              >
                03
              </div>
              <div
                className={`${styles.stepNumber} ${styles.stepNumberr}  tracking-widest`}
              >
                CANCELLATIONS
              </div>
            </div>
            <p
              className={`${styles.descriptionText} ${styles.descriptionTextt}`}
            >
              There is *no cancellation or refund* for purchased packages. Once
              a package is purchased, it must be completed within the designated
              validity period.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#efede9] ">
        <section className="flex sm:w-[854px] py-24 flex-col items-center justify-center mx-auto ">
          <h2 className="Manrope text-[21px] text-center font-semibold tracking-[0.26rem] sm:pr-5 leading-10 text-[#473a3a] ">
            RETURN AND REFUND POLICY
            <br />
            FOR PRODUCTS
          </h2>
          <p className="text-center my-8 px-6 mb-14 Helvetica sm:w-[433px] text-[#473a3a] ">
            At Shaped, we want to ensure you're fully satisfied with your
            purchase. Below is our policy for returns and refunds:
          </p>

          <div className="flex Helvetica flex-col items-center sm:items-stretch justify-center  sm:flex-row">
            <div
              className="sm:pr-6 pb-8 sm:pb-0 border-b-2 sm:border-b-0 mx-10 sm:mx-0 sm:w-[253px]  text-[#473a3a] "
              style={{ borderColor: "rgb(166 159 156)" }}
            >
              <div className="flex items-center ">
                <div
                  className={styles.roundNumber}
                  style={{ marginRight: "15px" }}
                >
                  01
                </div>
                <div
                  className={`${styles.stepNumber} ${styles.stepNumberr} tracking-widest`}
                >
                  ELIGIBILITY FOR RETURN/REFUND
                </div>
              </div>
              <p
                className={`${styles.descriptionText} ${styles.descriptionTextt}`}
              >
                Clients have up to *3 days* from the date of product arrival to
                request a return or refund. If you are unsatisfied with your
                purchase or if there are any issues with the product, please
                contact us within this timeframe.
              </p>
            </div>{" "}
            <div
              className=" sm:pl-6 mx-10 sm:mx-0  sm:border-b-0 sm:mr-6 py-8 sm:py-0 border-b-2 sm:border-l-2  sm:w-[253px]  text-[#473a3a] "
              style={{ borderColor: "rgb(166 159 156)" }}
            >
              <div className="flex items-center">
                <div
                  className={styles.roundNumber}
                  style={{ marginRight: "15px" }}
                >
                  02
                </div>
                <div
                  className={`${styles.stepNumber} ${styles.stepNumberr}  tracking-widest`}
                >
                  CONDITIONS FOR RETURN
                </div>
              </div>
              <p
                className={`${styles.descriptionText} ${styles.descriptionTextt}`}
              >
                Products must be returned in their original packaging and
                condition. For items with defects or issues, please provide
                details of the issue when requesting the return.
              </p>
            </div>{" "}
            <div
              className="sm:pl-6  sm:w-[253px] pt-8 sm:pt-0  sm:border-l-2 px-10 sm:px-0   text-[#473a3a] "
              style={{ borderColor: "rgb(166 159 156)" }}
            >
              <div className="flex items-center">
                <div
                  className={styles.roundNumber}
                  style={{ marginRight: "15px" }}
                >
                  03
                </div>
                <div
                  className={`${styles.stepNumber} ${styles.stepNumberr}  tracking-widest`}
                >
                  NON-REFUNDABLE / NON-RETURNABLE
                </div>
              </div>
              <p
                className={`${styles.descriptionText} ${styles.descriptionTextt}`}
              >
                After the *3-day* window has passed, *no returns or refunds*
                will be accepted. Products that show signs of excessive use or
                damage due to misuse will not be eligible for return or refund,
                even within the 3-day window.
              </p>
            </div>
            <div
              className="sm:pl-6  sm:w-[253px] sm:ml-6  pt-8 mt-8 sm:mt-0 border-t-2 sm:border-t-0 sm:pt-0  sm:border-l-2 mx-10 sm:px-0 sm:mr-0   text-[#473a3a] "
              style={{ borderColor: "rgb(166 159 156)" }}
            >
              <div className="flex items-center">
                <div
                  className={styles.roundNumber}
                  style={{ marginRight: "15px" }}
                >
                  04
                </div>
                <div
                  className={`${styles.stepNumber} ${styles.stepNumberr}  tracking-widest`}
                >
                  REFUND PROCESS
                </div>
              </div>
              <p
                className={`${styles.descriptionText} ${styles.descriptionTextt}`}
              >
                Once the returned product is received and inspected, you will be
                notified of the approval or rejection of your refund. Approved
                refunds will be processed to the original payment method within
                *7-10 business days*.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
