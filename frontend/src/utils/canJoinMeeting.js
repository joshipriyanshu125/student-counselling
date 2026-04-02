export const canJoinMeeting = (dateStr, timeStr) => {
    try {
        if (!dateStr || !timeStr) return false;

        // Parse date (ignoring time part of ISO string)
        const d = new Date(dateStr)
        const year = d.getFullYear()
        const month = d.getMonth()
        const day = d.getDate()

        // Parse time (e.g. "10:00 AM")
        const [time, modifier] = timeStr.split(' ')
        let [hours, minutes] = time.split(':')

        hours = parseInt(hours, 10)
        minutes = parseInt(minutes, 10)

        if (modifier === 'PM' && hours < 12) hours += 12
        if (modifier === 'AM' && hours === 12) hours = 0

        // Create meeting start time
        const meetingStart = new Date(year, month, day, hours, minutes)

        // Current time
        const now = new Date()

        // allow joining 15 mins before the scheduled time
        const gracePeriodBefore = 15 * 60 * 1000;
        const startTimeWithGrace = new Date(meetingStart.getTime() - gracePeriodBefore);

        // allow joining only during a limited session window (default 75 mins total)
        const meetingDuration = 75 * 60 * 1000;
        const meetingWindowEnd = new Date(meetingStart.getTime() + meetingDuration);

        return now >= startTimeWithGrace && now <= meetingWindowEnd;

    } catch (error) {
        console.error("Error in canJoinMeeting:", error)
        return false
    }
}