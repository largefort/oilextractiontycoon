const adventures = [
  { title: "Save the Princess", description: "The princess has been captured by a dragon. Save her!", options: ["Fight the dragon", "Sneak into the castle", "Negotiate with the dragon"] },
  { title: "Find the Lost Treasure", description: "A treasure is hidden in the forest. Find it!", options: ["Search the forest", "Ask the locals", "Buy a treasure map"] },
  // Add more adventures here
];

function generateAdventure() {
  const adventure = adventures[Math.floor(Math.random() * adventures.length)];
  const adventureDiv = document.createElement('div');
  adventureDiv.className = 'medieval-note';
  adventureDiv.innerHTML = `
    <h3>${adventure.title}</h3>
    <p>${adventure.description}</p>
    <div>
      ${adventure.options.map(option => `<button onclick="chooseOption('${option}')">${option}</button>`).join(' ')}
    </div>
  `;
  document.getElementById('adventure-list').appendChild(adventureDiv);
  speakText(adventureDiv);
}

function chooseOption(option) {
  alert(`You chose: ${option}`);
}
webViewAd.addAd({