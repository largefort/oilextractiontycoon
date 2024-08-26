document.addEventListener('deviceready', async () => {
    try {
        // Obtain user consent first if required (not included here, implement as needed)
        await admob.start(); // Start loading ads

        // Initialize WebViewAd
        let webViewAd = new admob.WebViewAd({
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            adsense: 'ca-pub-7136613030546059', // Replace with your AdSense publisher ID
            npa: nonPersonalizedAds ? '1' : '', // Set NPA if non-personalized ads are needed
        });

        // Add the first ad (e.g., a banner ad)
        webViewAd.addAd({
            element: document.querySelector('.map'), // Replace with your ad element's selector
            slot: '3724998997', // Replace with your ad slot ID
        });

        // Add another ad with a specific format (e.g., rectangle)
        webViewAd.addAd({
            element: document.querySelector('.tab-content'), // Replace with your ad element's selector
            slot: '3724998997', // Replace with your ad slot ID
            format: 'rectangle, horizontal', // Ad format
        });

        // Add a third ad with different formatting options (e.g., horizontal without full width)
        webViewAd.addAd({
            element: document.querySelector('.tab-content'), // Replace with your ad element's selector
            slot: '3724998997', // Replace with your ad slot ID
            format: 'vertical', // Ad format
            fullWidth: false, // Disable full width
        });

        console.log("Ads have been successfully initialized and added.");

    } catch (error) {
        console.error("Error initializing AdMob or adding ads:", error);
    }
}, false);
