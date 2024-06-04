function loadWindyMap(mapElement, lat, lon) {
  const windyApi = '***************************************
  const windyKey = 'BFe5UWqrmFQkyNxcy2BIUuoSba46SVet';
  const overlay = L.tileLayer(windyApi + 'webcams-tile/{z}/{x}/{y}.png', {
    attribution: '© 
