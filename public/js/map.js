let mapToken = "pk.eyJ1IjoiMjIxZmEwNDExOCIsImEiOiJjbTM3ZGltb2gwZXVlMmpzZTR0cDV5ZnJrIn0.DzDCP7Md1pzCWDZLpzL9vg"
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.6593, 27.5650], // starting position [lng, lat]
    zoom: 15.1, // starting zoom
    pitch: 62, // starting pitch
    bearing: -20 // starting bearing
});
const marker = new mapboxgl.Marker()
    .setLngLat([12.554729], [55.70651])
    .addTo(map)

map.on('style.load', () => {
    map.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: {
            type: 'LineString',
            coordinates: [
                [2.293389857555951, 48.85896319631851],
                [2.2890810326441624, 48.86174223718291]
            ]
        }
    });

    map.addLayer({
        id: 'line',
        source: 'line',
        type: 'line',
        paint: {
            'line-width': 12,
            // The `*-emissive-strength` properties control the intensity of light emitted on the source features.
            // To enhance the visibility of a line in darker light presets, increase the value of `line-emissive-strength`.
            'line-emissive-strength': 0.8,
            'line-gradient': [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                'red',
                1,
                'blue'
            ]
        }
    });
});
