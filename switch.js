function toggleGeoVisualEffects(isEnabled) {
    const mapElement = document.querySelector('.enhanced-map');
    if (isEnabled) {
        mapElement.classList.add('hd-quality-on');
    } else {
        mapElement.classList.remove('hd-quality-on');
    }
}
