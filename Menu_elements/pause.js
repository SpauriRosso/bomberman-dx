document.addEventListener("DOMContentLoaded", () => {
  const pauseMenu = document.getElementById("pauseMenu");
  const resumeButton = document.getElementById("resumeButton");
  const quitButton = document.getElementById("quitButton");

  // Function to show the pause menu
  function showPauseMenu() {
    pauseMenu.style.display = "block";
    // Additional logic to pause the game can be added here
  }

  // Function to hide the pause menu
  function hidePauseMenu() {
    pauseMenu.style.display = "none";
    // Additional logic to resume the game can be added here
  }

  // Event listener for the resume button
  resumeButton.addEventListener("click", () => {
    hidePauseMenu();
    // Logic to resume the game
  });

  // Event listener for the quit button
  quitButton.addEventListener("click", () => {
    // Logic to quit the game (e.g., redirect to main menu)
  });

  // Show the pause menu when the 'Escape' key is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "escape") {
      showPauseMenu();
    }
  });
});
