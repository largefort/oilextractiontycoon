   function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // Enable pointer events on the map when World Map tab is active
        if (tabId === 'world-map-tab') {
            document.getElementById('map').style.pointerEvents = 'auto';
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        } else {
            document.getElementById('map').style.pointerEvents = 'none';
        }
    }

    // Mobile User Interface Stabilizer (MUIS)
    function stabilizeUI() {
        map.invalidateSize();
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById('world-map-tab').classList.add('active');
    }

    map.on('movestart', function() {
        stabilizeUI();
    });

    map.on('moveend', function() {
        stabilizeUI();
    });

    window.addEventListener('resize', function() {
        stabilizeUI();
    });

    window.addEventListener('orientationchange', function() {
        stabilizeUI();
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, error => {
                console.log('ServiceWorker registration failed: ', error);
            });
        });
    }
