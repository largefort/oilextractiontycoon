/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    // select the right Ad Id according to platform
      var admobid = {};
      if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
        admobid = {
          banner: 'ca-app-pub-5816082932921993/5683636470', // or DFP format "/6253334/dfp_example_ad"
          interstitial: 'ca-app-pub-xxx/yyy'
        };
      } else { // for ios
        admobid = {
          banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
          interstitial: 'ca-app-pub-xxx/kkk'
        };
      }

      // it will display smart banner at top center, using the default options
      if(AdMob) AdMob.createBanner({
        adSize: 'FULL_BANNER',
        adId: admobid.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: true });

        // use banner
        createBanner(adId/options, success, fail);
        removeBanner();
        showBanner(position);
        showBannerAtXY(x, y);
        hideBanner();

        // use interstitial
        prepareInterstitial(adId/options, success, fail);
        showInterstitial();
        isInterstitialReady(function(ready){ if(ready){ } });

        // use reward video
        prepareRewardVideoAd(adId/options, success, fail);
        showRewardVideoAd();

        // set values for configuration and targeting
        setOptions(options, success, fail);

        // get user ad settings
        getAdSettings(function(inf){ inf.adId; inf.adTrackingEnabled; }, fail);

        // onAdLoaded
        // onAdFailLoad
        // onAdPresent
        // onAdDismiss
        // onAdLeaveApp
        document.addEventListener('onAdFailLoad', function(e){
            // handle the event
        });

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
