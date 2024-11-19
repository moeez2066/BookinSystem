import emailjs from "emailjs-com";

/**
 * Sends an email using EmailJS.
 * @param {Object} params - The dynamic parameters for the email template.
 * @param {string} params.recipient_email - The recipient's email address.
 * @param {string} params.customer_name - The name of the customer.
 * @param {string} params.company_name - The company name.
 * @param {string} params.booking_reference - The booking reference number.
 * @param {string} params.client_name - The client's name.
 * @param {string} params.trainer_name - The trainer's name.
 * @param {string} params.scheduling_dates - The scheduling dates.
 * @param {string} params.package_size - The package size.
 * @param {string} params.package_price - The package price.
 * @param {string} params.start_period - The start date of the booking.
 * @param {string} params.end_date - The end date of the booking.
 * @param {string} params.location - The booking location.
 * @param {string} params.client_panel_url - The URL for the client panel.
 * @param {string} params.policy - The policy details.
 * @param {string} params.support_email - The support email address.
 * @param {number} params.current_year - The current year.
 * @returns {Promise} - Resolves on success, rejects on error.
 */
export const sendEmail = async (params) => {
  const templateParams = {
    recipient_email: params.recipient_email,
    customer_name: params.customer_name,
    company_name: params.company_name,
    booking_reference: params.booking_reference,
    client_name: params.client_name,
    trainer_name: params.trainer_name,
    scheduling_dates: params.scheduling_dates,
    package_size: params.package_size,
    package_price: params.package_price,
    start_period: params.start_period,
    end_date: params.end_date,
    location: params.location,
    client_panel_url: params.client_panel_url,
    policy: params.policy,
    support_email: params.support_email,
    current_year: params.current_year,
  };

  try {
    const response = await emailjs.send(
      "service_04z6fy3", // Replace with your actual service ID
      "template_xgrsxtg", // Replace with your actual template ID
      templateParams,
      "mjQTH4iM8w4jjnFHr" // Replace with your actual user/public key
    );
    console.log("Email sent successfully!", response.status, response.text);
    return "Email sent successfully!";
  } catch (error) {
    console.error("Failed to send email.", error);
    throw new Error("Failed to send email.");
  }
};


/**
 * Sends an email using EmailJS.
 * @param {Object} params - The dynamic parameters for the email template.
 * @param {string} params.recipient_email - The recipient's email address.
 * @param {string} params.customer_name - The name of the customer.
 * @param {string} params.company_name - The company name.
 * @param {string} params.booking_reference - The booking reference number.
 * @param {string} params.client_name - The client's name.
 * @param {string} params.trainer_name - The trainer's name.
 * @param {string} params.scheduling_dates - The scheduling dates.
 * @param {string} params.package_size - The package size.
 * @param {string} params.package_price - The package price.
 * @param {string} params.start_period - The start date of the booking.
 * @param {string} params.end_date - The end date of the booking.
 * @param {string} params.location - The booking location.
 * @param {string} params.client_panel_url - The URL for the client panel.
 * @param {string} params.policy - The policy details.
 * @param {string} params.support_email - The support email address.
 * @param {number} params.current_year - The current year.
 * @returns {Promise} - Resolves on success, rejects on error.
 */
export const sendTrainerEmail = async (params) => {
  const templateParams = {
    recipient_email: params.recipient_email,
    customer_name: params.customer_name,
    company_name: params.company_name,
    booking_reference: params.booking_reference,
    client_name: params.client_name,
    trainer_name: params.trainer_name,
    scheduling_dates: params.scheduling_dates,
    package_size: params.package_size,
    package_price: params.package_price,
    start_period: params.start_period,
    end_date: params.end_date,
    location: params.location,
    client_panel_url: params.client_panel_url,
    policy: params.policy,
    support_email: params.support_email,
    current_year: params.current_year,
  };

  try {
    const response = await emailjs.send(
      "service_04z6fy3", // Replace with your actual service ID
      "template_5wybo4e", // Replace with your actual template ID
      templateParams,
      "mjQTH4iM8w4jjnFHr" // Replace with your actual user/public key
    );
    console.log("Email sent successfully!", response.status, response.text);
    return "Email sent successfully!";
  } catch (error) {
    console.error("Failed to send email.", error);
    throw new Error("Failed to send email.");
  }
};
