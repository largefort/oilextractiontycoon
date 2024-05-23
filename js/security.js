// Detect unauthorized access and display warning
document.addEventListener('DOMContentLoaded', (event) => {
    const unauthorized = isUnauthorizedAccess();
    if (unauthorized) {
        displayUnauthorizedWarning();
    }
});

function isUnauthorizedAccess() {
    // Check if the current URL is unauthorized
    const currentUrl = window.location.href;
    const unauthorizedDomains = ['github.io', 'githubpages']; // Add more if needed
    return unauthorizedDomains.some(domain => currentUrl.includes(domain));
}

function displayUnauthorizedWarning() {
    document.body.innerHTML = `
        <div id="unauthorized-warning">
            <h1>Unauthorized Access</h1>
            <p>You are not authorized to view this content. Please delete this page immediately.</p>
            <p>This game and its source code are protected by copyright and its illegal to steal someones games sourcecodes this action and the users on github who are legit copycats will face serious consequence!!!!.</p>
        </div>
    `;
    setTimeout(() => {
        window.close();
    }, 5000); // Close the tab after 5 seconds
}
