/** Matches Book Appointment time options — shown per day in the availability modal. */
export const STANDARD_BOOKING_SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM"];

export const WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export function getDefaultWeeklyAvailability() {
    return WEEKDAYS.map((day) => ({
        day,
        slots: [...STANDARD_BOOKING_SLOTS],
    }));
}
