// developerAccessControl.js

(function () {
  const developerUsername = 'jafetegill17'; // Replace with your GitHub username

  function checkDeveloperAccess() {
    // Fetch GitHub API to get the authenticated user information
    fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `token ${localStorage.getItem('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')}` // User must provide a valid GitHub token
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.login === developerUsername) {
          console.log(`Welcome, ${developerUsername}! Access granted to GeoTycoon: London DLC.`);
          document.getElementById('dlc-content').style.display = 'block'; // Show the DLC content
        } else {
          alert('Access denied! You are not authorized to view this content.');
          window.location.href = 'https://geotycoon.online'; // Redirect to main site
        }
      })
      .catch(error => {
        console.error('Error fetching GitHub user:', error);
        alert('Error verifying access. Please ensure you are logged in to GitHub.');
        window.location.href = 'https://geotycoon.online'; // Redirect to main site on error
      });
  }

  // Check if a GitHub token is stored in local storage
  if (localStorage.getItem('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')) {
    checkDeveloperAccess();
  } else {
    const token = prompt('Enter your GitHub personal access token to verify your identity:');
    if (token) {
      localStorage.setItem('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', token);
      checkDeveloperAccess();
    } else {
      alert('Access denied! You must provide a valid GitHub token.');
      window.location.href = 'https://geotycoon.online'; // Redirect to main site if no token is provided
    }
  }
})();
