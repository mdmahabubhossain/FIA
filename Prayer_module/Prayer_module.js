// Prayer_module.js

/**
 * Initializes the module and populates the container with the basic structure.
 * Also fetches and displays the current date and time.
 * @param {HTMLElement} container - The HTML element to populate.
 */
export function init(container) {
    if (!container) {
        console.error('Container is not defined or invalid.');
        return;
    }

    // Set up the container structure
    container.innerHTML = `
        <div id="module-header">
            <div id="current-time"></div>
            <div id="current-date"></div>
        </div>
        <div id="prayer-times"></div>
    `;

    // Update time and date
    updateCurrentTime();
    updateCurrentDate();
    setInterval(updateCurrentTime, 1000); // Update clock every second
}

/**
 * Fetches prayer times from a JSON URL and displays them in the container.
 * @param {string} url - The URL to fetch prayer times data from.
 * @param {HTMLElement} container - The HTML element to display the data in.
 */
export async function loadPrayerTimes(url, container) {
    if (!container || !url) {
        console.error('Container or URL is invalid.');
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch prayer times data.');

        const prayerTimes = await response.json();
        const today = new Date().toISOString().split('T')[0];
        const prayerTimesContainer = document.getElementById('prayer-times');

        if (prayerTimes[today]) {
            prayerTimesContainer.innerHTML = `
                <h3>Prayer Times for Today</h3>
                <ul>
                    ${Object.entries(prayerTimes[today])
                        .map(([prayer, time]) => `<li><strong>${prayer}:</strong> ${time}</li>`)
                        .join('')}
                </ul>
            `;
        } else {
            prayerTimesContainer.innerHTML = `<p>No prayer times available for today (${today}).</p>`;
        }
    } catch (error) {
        console.error('Error loading prayer times:', error);
        container.innerHTML = `<p>Error loading prayer times: ${error.message}</p>`;
    }
}

/**
 * Updates the current time and displays it in the header.
 */
function updateCurrentTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
}

/**
 * Updates the current date and displays it in the header.
 */
function updateCurrentDate() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const day = now.toLocaleDateString('en-US', { weekday: 'long' });
        const month = now.toLocaleDateString('en-US', { month: 'long' });
        const dateNumber = now.getDate();
        const year = now.getFullYear();
        const ordinal = getOrdinalSuffix(dateNumber);
        dateElement.textContent = `${day}, ${dateNumber}${ordinal} ${month}, ${year}`;
    }
}

/**
 * Returns the ordinal suffix for a number (e.g., "st", "nd", "rd", "th").
 * @param {number} n - The number to get the ordinal suffix for.
 * @returns {string} The ordinal suffix.
 */
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
