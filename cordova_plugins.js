cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-ionic-webview.IonicWebView",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "Ionic.WebView"
      ]
    },
    {
      "id": "cordova-plugin-admobpro.AdMob",
      "file": "plugins/cordova-plugin-admobpro/www/AdMob.js",
      "pluginId": "cordova-plugin-admobpro",
      "clobbers": [
        "window.AdMob"
      ]
    },
    {
      "id": "cordova-plugin-inapppurchases.InAppBilling",
      "file": "plugins/cordova-plugin-inapppurchases/www/billing-android.js",
      "pluginId": "cordova-plugin-inapppurchases",
      "merges": [
        "inAppPurchases"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-ionic-webview": "5.0.0",
    "cordova-plugin-extension": "1.6.0",
    "cordova-plugin-admobpro": "8.13.1",
    "cordova-plugin-inapppurchases": "3.0.3"
  };
});