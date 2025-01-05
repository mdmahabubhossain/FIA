export async function init(container) {
    if (!container) return;

    // Set up the container structure
    container.innerHTML = `
        <div id="middle-header">
            <div id="system-clock"></div>
            <div id="system-date"></div>
        </div>
        <div id="prayer-times"></div>
        <div id="error-message" style="color: red;"></div>
    `;

    // Apply basic styling
    container.style.padding = '10px';
    container.style.backgroundColor = '#f9f9f9';

    // Initialize the clock and date
    updateSystemClock();
    updateSystemDate();
    setInterval(updateSystemClock, 1000); // Update clock every second

    // Fetch and display prayer times
    await fetchPrayerTimes();
}

function updateSystemClock() {
    const now = new Date();
    const clock = document.getElementById('system-clock');
    if (clock) {
        clock.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
}

function updateSystemDate() {
    const now = new Date();
    const date = document.getElementById('system-date');
    if (date) {
        const day = now.toLocaleDateString('en-US', { weekday: 'long' });
        const month = now.toLocaleDateString('en-US', { month: 'long' });
        const dateNumber = now.getDate();
        const year = now.getFullYear();
        const ordinal = getOrdinalSuffix(dateNumber);
        date.textContent = `${day}, ${dateNumber}${ordinal} ${month}, ${year}`;
    }
}

function getOrdinalSuffix(n) {
    if (n > 3 && n < 21) return 'th'; // Catch 11th-13th
    switch (n % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

async function fetchPrayerTimes() {
    const prayerTimesUrl = 'https://raw.githubusercontent.com/mdmahabubhossain/FIA/refs/heads/main/prayer_times_2025.json';
    const prayerTimesContainer = document.getElementById('prayer-times');
    const errorMessageContainer = document.getElementById('error-message');

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
            // Display today's prayer times
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
