// screensizegatherer.js

(function() {
    // Function to get the screen dimensions
    function getScreenDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        return { width, height };
    }

    // Function to adjust UI elements based on screen size
    function adjustUIForScreenSize() {
        const { width, height } = getScreenDimensions();

        // Example of adjusting font sizes and element dimensions
        const baseFontSize = Math.min(width, height) / 25; // Base font size calculation
        document.documentElement.style.fontSize = `${baseFontSize}px`;

        // Adjust specific elements based on screen dimensions
        const resourceContainer = document.querySelector('.resource-container');
        const sidebar = document.querySelector('.sidebar');
        const tabContent = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.button-container button');
        const modals = document.querySelectorAll('.modal-content');

        if (resourceContainer) {
            resourceContainer.style.width = `${Math.min(95, width * 0.9)}%`;
            resourceContainer.style.padding = `${baseFontSize * 0.3}px ${baseFontSize * 0.6}px`;
        }

        if (sidebar) {
            sidebar.style.width = `${Math.min(80, width * 0.15)}px`;
            sidebar.style.paddingTop = `${baseFontSize * 1}px`;
        }

        tabContent.forEach(tab => {
            tab.style.width = `calc(100% - ${sidebar.style.width})`;
            tab.style.fontSize = `${baseFontSize * 0.9}px`;
            tab.style.padding = `${baseFontSize * 0.6}px`;
        });

        buttons.forEach(button => {
            button.style.padding = `${baseFontSize * 0.5}px`;
            button.style.fontSize = `${baseFontSize * 0.9}px`;
        });

        modals.forEach(modal => {
            modal.style.padding = `${baseFontSize * 0.7}px`;
            modal.style.fontSize = `${baseFontSize * 0.9}px`;
            modal.style.width = `${Math.min(90, width * 0.8)}%`;
        });

        // Additional adjustments for other elements
        // Adjust sidebar button icons, pop-ups, etc.
    }

    // Initial adjustment on page load
    window.addEventListener('load', adjustUIForScreenSize);

    // Adjust UI on window resize
    window.addEventListener('resize', adjustUIForScreenSize);

    // Optional: Listen to orientation change
    window.addEventListener('orientationchange', adjustUIForScreenSize);
})();
