function speakText(element) {
  const text = element.getAttribute("aria-label") || element.innerText;
  const speech = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(speech);
}
