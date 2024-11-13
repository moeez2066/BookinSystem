const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client();
async function calculateDistanceAndDuration(origin, destinationCoords) {
  try {
    const response = await googleMapsClient.distancematrix({
      params: {
        origins: [origin],
        destinations: [destinationCoords],
        mode: "driving",
        key: "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o",
      },
      timeout: 10000,
    });
    const results = response.data.rows[0].elements[0];
    const distance = results.distance.text;
    const duration = results.duration.text;
    console.log(`Distance: ${distance}, Duration: ${duration}`);
    return { distance, duration };
  } catch (error) {
    console.error("Error calculating distance and duration:", error);
    throw error;
  }
}
module.exports = calculateDistanceAndDuration;
