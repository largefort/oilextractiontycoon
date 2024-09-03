// developerAccessControl.js

(function () {
  const developerUsername = 'jafetegill17'; // Replace with your GitHub username

  function checkDeveloperAccess() {
    // Use GitHub's OAuth flow to check the authenticated user's username
    const oauthUrl = `https://github.com/login/oauth/authorize?client_id=Ov23lirrXbtmuwqQNiLH&scope=user`;

    // Open the OAuth window to authenticate the user
    window.open(oauthUrl, '_blank', 'width=500,height=600');

    // Check for user authentication
    window.addEventListener('message', function (event) {
      if (event.origin !== window.location.origin) return; // Ensure security by checking origin

      const userData = event.data;
      if (userData && userData.login === developerUsername) {
        console.log(`Welcome, ${developerUsername}! Access granted to GeoTycoon: London DLC.`);
        document.getElementById('dlc-content').style.display = 'block'; // Show the DLC content
      } else {
        alert('Access denied! You are not authorized to view this content.');
        window.location.href = 'https://geotycoon.online'; // Redirect to the main site
      }
    });
  }

  // Start checking for developer access
  checkDeveloperAccess();
})();

