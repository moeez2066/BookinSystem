const generateTimeSlots = (start, end, bookedSlots) => {
    const slots = [];

    // Parse booked ranges into start and end times in fractional hours
    const bookedRanges = bookedSlots.map((slot) => {
        const [startTime, endTime] = slot.time.split(" - ");
        const parseHour = (time) => {
            const [hour, period] = time.split(" ");
            return period === "PM" && hour !== "12" ? parseInt(hour) + 12 : parseInt(hour);
        };
        const parseMinute = (time) => parseInt(time.split(":")[1] || 0);

        const startHour = parseHour(startTime);
        const startMinute = parseMinute(startTime);
        const endHour = parseHour(endTime);
        const endMinute = parseMinute(endTime);

        const durationInMinutes = parseInt(slot.duration.split(" ")[0]);
        const endHourWithDuration = endHour + (endMinute + durationInMinutes) / 60;

        return {
            start: startHour + startMinute / 60,
            end: endHourWithDuration,
            exactStart: { hour: startHour, minute: startMinute }, // Exact start time for comparison
        };
    });

    let currentHour = start;
    let currentMinute = 0; // Always start at 0 if no booked slots

    while (currentHour < end) {
        const currentTime = currentHour + currentMinute / 60;

        // Check if the current time overlaps with any booked range
        const overlappingRange = bookedRanges.find(
            (range) => currentTime >= range.start && currentTime < range.end
        );

        if (overlappingRange) {
            // Skip this time range and adjust currentHour and currentMinute
            currentHour = Math.floor(overlappingRange.end);
            currentMinute = Math.round((overlappingRange.end % 1) * 60);
            continue;
        }

        // Format the start and end times for the time slot
        const slotStart = new Date(1970, 0, 1, currentHour, currentMinute);
        const slotEnd = new Date(1970, 0, 1, currentHour + 1, currentMinute);

        // Ensure the slot end time does not exceed the `end` hour
        if (slotEnd.getHours() >= end) {
            break;
        }

        // Check if the end time matches the start time of any booked slot
        const isExcluded = bookedRanges.some(
            (range) =>
                slotEnd.getHours() === range.exactStart.hour &&
                slotEnd.getMinutes() === range.exactStart.minute
        );

        if (!isExcluded) {
            slots.push(
                `${slotStart.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} - ${slotEnd.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
            );
        }

        // Increment the time by 1 hour
        currentHour++;
    }

    return slots;
};

// Example usage
const startHour = 6; // 6 AM
const endHour = 20; // 8 PM
const bookedSlots = [
    { time: "7 AM - 8 AM", duration: "3 mins" },
    { time: "2:03 PM - 3:03 PM", duration: "13 mins" },
];

const allSlots = generateTimeSlots(startHour, endHour, bookedSlots);
console.log("Generated time slots:", allSlots);
