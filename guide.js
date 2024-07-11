$(document).ready(function() {
    var tutorialSteps = [
        {
            arrowTarget: '.bottom-nav button:nth-child(2)', // Controls tab button
            offset: { top: -60, left: 25 } // Adjust arrow position relative to target
        },
        {
            arrowTarget: '#controls-tab button:nth-child(1)', // Buy Land button
            offset: { top: -60, left: 25 } // Adjust arrow position relative to target
        },
        {
            arrowTarget: '#controls-tab button:nth-child(2)', // Buy Oil Rig button
            offset: { top: -60, left: 25 } // Adjust arrow position relative to target
        },
        {
            arrowTarget: '.bottom-nav button:nth-child(1)', // World Map tab button
            offset: { top: -60, left: 25 } // Adjust arrow position relative to target
        }
    ];

    // Create the tutorial arrow element and append it to the body
    var tutorialArrow = $('<div id="tutorial-arrow" class="tutorial-arrow"></div>');
    $('body').append(tutorialArrow);

    // Function to show the current tutorial step
    function showTutorialStep(step) {
        if (step < tutorialSteps.length) {
            var stepData = tutorialSteps[step];
            var target = $(stepData.arrowTarget);
            var offset = target.offset();
            $('#tutorial-arrow').css({
                top: offset.top + stepData.offset.top,
                left: offset.left + target.width() / 2 + stepData.offset.left
            }).show();
        } else {
            // Hide arrow if tutorial steps are completed
            $('#tutorial-arrow').hide();
        }
    }

    // Function to advance to the next tutorial step and save it to local storage
    function nextTutorialStep() {
        currentStep++;
        showTutorialStep(currentStep);
        localStorage.setItem('tutorialStep', currentStep);
    }

    // Get the current step from local storage or default to 0
    var currentStep = parseInt(localStorage.getItem('tutorialStep')) || 0;

    // Initialize the tutorial
    showTutorialStep(currentStep);

    // Example bindings to advance the tutorial; adjust as needed for your game
    $('.bottom-nav button:nth-child(2)').on('click', nextTutorialStep); // Controls tab button
    $('#controls-tab button:nth-child(1)').on('click', nextTutorialStep); // Buy Land button
    $('#controls-tab button:nth-child(2)').on('click', nextTutorialStep); // Buy Oil Rig button
    $('.bottom-nav button:nth-child(1)').on('click', nextTutorialStep); // World Map tab button
});
