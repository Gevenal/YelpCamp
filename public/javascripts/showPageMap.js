
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    //center: campground.geometry.coordinates, //center around the specified location *caution: cannot work in this current version and do not know the reasons*
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
// map.on('style.load', () => {
//     map.setFog({}); // Set the default atmosphere style
// });
map.addControl(new mapboxgl.NavigationControl(),);
new mapboxgl.Marker()
    .setLngLat([-74.5, 40])
    // .setPopup(
    //     new mapboxgl.Popup({ offset: 25 })
    //         .setHTML(
    //             `<h3>${campground.title}</h3>`
    //         )
    // )
    .addTo(map)