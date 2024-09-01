document.querySelectorAll('.bottom-nav button').forEach(button => {
    button.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
        
        // Add 'active' class to the clicked button
        this.classList.add('active');
        
        // Show the corresponding tab content
        const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        showTab(tabId);
        
        // Trigger the bounce effect
        this.querySelector('i').classList.add('bounce-animation');
        this.querySelector('span').classList.add('bounce-animation');
        
        // Remove the bounce effect after animation ends
        setTimeout(() => {
            this.querySelector('i').classList.remove('bounce-animation');
            this.querySelector('span').classList.remove('bounce-animation');
        }, 400); // Duration of the bounce animation
    });
});
