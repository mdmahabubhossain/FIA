export async function fetchPrayerTimes(prayerTimesUrl, prayerTimesContainerId, errorMessageContainerId) {
    const prayerTimesContainer = document.getElementById(prayerTimesContainerId);
    const errorMessageContainer = document.getElementById(errorMessageContainerId);

    try {
        // Fetch data from the URL
        const response = await fetch(prayerTimesUrl);
        if (!response.ok) throw new Error('Failed to fetch prayer times data.');

        const prayerTimes = await response.json();

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        console.log('Today\'s Date:', today); // Debugging log

        // Find today's prayer times
        const todayPrayerTimes = prayerTimes.find(entry => entry.Date === today);

        if (todayPrayerTimes) {
            // Clear previous content
            prayerTimesContainer.innerHTML = `
                <h3>Prayer Times for Today (${today})</h3>
                <ul>
                    <li><strong>Fajr:</strong> ${todayPrayerTimes.Fajr}</li>
                    <li><strong>Dhuhur:</strong> ${todayPrayerTimes.Dhuhur}</li>
                    <li><strong>Asr:</strong> ${todayPrayerTimes.Asr}</li>
                    <li><strong>Maghrib:</strong> ${todayPrayerTimes.Maghrib}</li>
                    <li><strong>Ishaa:</strong> ${todayPrayerTimes.Ishaa}</li>
                </ul>
            `;
        } else {
            prayerTimesContainer.innerHTML = `<p>No prayer times available for today (${today}).</p>`;
        }
    } catch (error) {
        console.error('Error loading prayer times:', error);
        prayerTimesContainer.innerHTML = '';
        errorMessageContainer.textContent = 'Error loading prayer times. Please try again later.';
    }
}
