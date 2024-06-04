function loadWindyMap(mapElement, lat, lon) {
  const windyApi = '***************************************
  const windyKey = 'YOUR_WINDY_API_KEY';
  const overlay = L.tileLayer(windyApi + 'webcams-tile/{z}/{x}/{y}.png', {
    attribution: '© 
