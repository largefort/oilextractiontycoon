// news.js — FIXED & STABLE

const newsHeadlines = [
    "GeoTycoon Wiki: Visit https://geotycoon.wiki.gg for guides and info.",
    "Oil prices surge as new reserves are discovered in the Arctic.",
    "Energy crisis looms as demand outpaces renewable supply.",
    "New technology promises 50% increase in mining efficiency.",
    "Government imposes new tariffs on imported steel.",
    "Mega-factory opens in China, expected to dominate global production.",
    "Record profits reported by major oil companies this quarter.",
    "Major power outage affects millions in the northeast.",
    "Environmental regulations tighten, impacting heavy industry.",
    "Automation revolutionizes manufacturing, cutting operational costs.",
    "Breakthrough in battery technology boosts energy storage capacity.",
    "Solar energy production hits record highs worldwide.",
    "Wind farm expansion promises to double clean energy output.",
    "Global demand for copper surges as infrastructure expands.",
    "Investment in green hydrogen reaches record levels.",
    "Industrial automation adoption accelerates across sectors.",
    "New carbon capture technologies reduce industrial emissions.",
    "Supply chain disruptions force innovation in logistics.",
    "Smart factories increase productivity with AI integration.",
    "Global push for renewable energy reshapes industrial markets."
];

let lastIndex = -1;

/**
 * Updates the scrolling news ticker safely
 */
function updateNewsTicker() {
    const ticker = document.getElementById('newsTicker');
    const container = document.querySelector('.news-ticker-container');

    if (!ticker || !container) return;

    let index;
    do {
        index = Math.floor(Math.random() * newsHeadlines.length);
    } while (index === lastIndex && newsHeadlines.length > 1);

    lastIndex = index;
    ticker.textContent = newsHeadlines[index];

    // Reset animation cleanly
    ticker.style.animation = 'none';
    ticker.offsetHeight; // force reflow

    // Calculate duration with sane limits
    const textWidth = ticker.offsetWidth;
    const containerWidth = container.offsetWidth;
    const pixelsPerSecond = 80; // speed control

    let duration = (textWidth + containerWidth) / pixelsPerSecond;
    duration = Math.min(Math.max(duration, 8), 25); // clamp 8–25s

    ticker.style.animation = `scroll ${duration}s linear infinite`;
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    updateNewsTicker();

    const ticker = document.getElementById('newsTicker');
    if (ticker) {
        ticker.addEventListener('animationiteration', updateNewsTicker);
    }
});
