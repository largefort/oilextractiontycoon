// news.js

// Array of industrial-themed news headlines
const newsHeadlines = [
    "Oil prices surge as new reserves are discovered in the Arctic.",
    "Energy crisis looms as demand outpaces renewable supply.",
    "New technology promises 50% increase in mining efficiency.",
    "Government imposes new tariffs on imported steel.",
    "Mega-factory opens in China, expected to dominate global production.",
    "Record profits for the leading oil company this quarter.",
    "Major power outage affects millions in the northeast.",
    "Environmental regulations tighten, impacting coal industry.",
    "Automation revolutionizes manufacturing, cuts jobs by 30%.",
    "Breakthrough in battery technology could end energy storage issues.",
    "Massive oil spill in the Gulf causes environmental concerns.",
    "Solar energy production hits record highs amid sunny season.",
    "New deal signed for global lithium supply, boosting electric vehicle production.",
    "Industrial espionage case uncovered in leading tech firm.",
    "Rare earth metals found in remote region, sparking mining rush.",
    "Wind farm expansion promises to double clean energy output.",
    "Steel production in Europe faces disruption due to supply chain issues.",
    "Groundbreaking ceremony held for world's largest solar power plant.",
    "Industrial accident at a major refinery leads to safety overhaul.",
    "Advancements in AI reduce factory downtime by 20%.",
    "Global demand for copper surges as electric infrastructure expands.",
    "Investment in green hydrogen tech reaches new heights.",
    "New regulations mandate 80% recycling of industrial waste.",
    "Electric vehicle sales soar, pushing battery production to capacity.",
    "Pioneering desalination plant opens, promising to ease water shortages.",
    "Heavy machinery manufacturer launches AI-driven equipment line.",
    "International trade tensions threaten to slow global industrial growth.",
    "Fossil fuel divestment movement gains momentum, affecting major oil firms.",
    "Breakthrough in carbon capture technology offers hope for emissions reduction.",
    "Logistics firms invest in autonomous delivery trucks to cut costs.",
    "Massive investment in nuclear fusion research sparks hope for limitless energy.",
    "Demand for skilled workers in tech manufacturing hits all-time high.",
    "Global semiconductor shortage continues to impact electronics production.",
    "Water scarcity in key regions forces industries to rethink usage strategies.",
    "New material discovered, poised to revolutionize construction industry.",
    "First fully automated port opens, signaling future of shipping logistics.",
    "Industrial drone technology sees rapid adoption in agriculture.",
    "New deal between major oil producers aims to stabilize global prices.",
    "Waste-to-energy plants gain popularity as cities struggle with landfill space.",
    "Countries race to secure rare minerals for battery production.",
    "Robotics advancements slash costs in automotive manufacturing.",
    "Plans announced for smart city powered entirely by renewable energy.",
    "Climate change impacts force rethinking of industrial supply chains.",
    "Global steel demand expected to rise sharply over the next decade.",
    "Advances in biofuel technology could reduce dependency on oil.",
    "3D printing revolutionizes the manufacturing of spare parts in the aerospace industry.",
    "Shipping companies invest heavily in greener, more efficient vessels.",
    "Industrial giants pledge to reduce carbon emissions by 50% by 2030.",
    "Major mining company shifts focus to sustainable extraction methods.",
    "Energy storage breakthroughs promise to stabilize renewable energy supply.",
    "New international regulations aim to curtail industrial pollution in oceans.",
    "Smart factories utilize IoT to streamline production and reduce waste.",
    "Uranium prices spike as nuclear energy gains favor in energy mix.",
    "AI-driven predictive maintenance reduces factory downtime by 35%.",
    "Construction industry faces shortages in key materials amid global demand surge.",
    "Vertical farming gains traction as a solution to urban food production challenges.",
    "Automakers ramp up electric vehicle production to meet rising consumer demand.",
    "New regulations require industrial plants to use 100% recycled water.",
    "Telecommunication companies expand 5G networks to support industrial automation.",
    "World's largest wind turbine begins operation, providing power to 50,000 homes.",
    "Bio-based plastics industry sees rapid growth as consumer demand for sustainability rises.",
    "High-speed rail projects accelerate, boosting infrastructure development.",
    "Hydropower plants upgrade technology to increase efficiency and reduce environmental impact.",
    "Heavy industry begins transition to hydrogen fuel in bid to reduce carbon footprint.",
    "Environmental groups call for stricter controls on mining in protected areas.",
    "Investment in quantum computing accelerates innovation in industrial processes.",
    "Emerging markets see rapid growth in industrial capacity and exports."
];

// Function to update the news ticker
function updateNewsTicker() {
    const newsTicker = document.getElementById('newsTicker');
    const randomIndex = Math.floor(Math.random() * newsHeadlines.length);
    newsTicker.innerText = newsHeadlines[randomIndex];
    
    // Calculate the duration based on the length of the text and container width
    const tickerContainer = document.querySelector('.news-ticker-container');
    const tickerWidth = tickerContainer.offsetWidth;
    const textWidth = newsTicker.offsetWidth;
    
    // Set the animation duration dynamically
    const duration = (textWidth + tickerWidth) / 100; // Adjust speed by dividing by a constant
    newsTicker.style.animationDuration = `${duration}s`;
}

// Initialize the news ticker with the first news item
updateNewsTicker();

// Update the news ticker after the animation completes
document.getElementById('newsTicker').addEventListener('animationend', updateNewsTicker);
