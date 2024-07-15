function chooseOption(option) {
  let outcome = "";
  switch(option) {
    case "Fight the dragon":
      outcome = "You bravely fought the dragon and won!";
      break;
    case "Sneak into the castle":
      outcome = "You successfully sneaked into the castle and saved the princess!";
      break;
    case "Negotiate with the dragon":
      outcome = "You managed to negotiate with the dragon and saved the princess peacefully.";
      break;
    case "Search the forest":
      outcome = "You found the treasure hidden under an old tree!";
      break;
    case "Ask the locals":
      outcome = "The locals gave you clues leading to the treasure!";
      break;
    case "Buy a treasure map":
      outcome = "The treasure map led you straight to the treasure!";
      break;
    default:
      outcome = "Your adventure had an unexpected outcome.";
      break;
  }
  alert(outcome);
}
