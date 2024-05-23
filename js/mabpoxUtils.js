"use strict";

/*
    This is the function that will generate a map on the page.
    It takes a map configuration object
    The mapConfig object has the following example structure:
    const mapConfiguration = {
        accessToken: MAPBOX_API_KEY,
        containerId: 'map',
        style: 'outdoors-v12',
        center: [-98.48725, 29.44879],
        zoom: 11
    }
    Here, there is a div in index.html with the id of 'map'
    The mapbox js library will find it and insert the map
    Style is any of the standard mapbox styles
    Center is [lng, lat]
    zoom is between 1 and 15, with 15 being the narrowest focus
*/

export const generateMap = async mapConfig => {
        mapboxgl.accessToken = mapConfig.accessToken;
        return new mapboxgl.Map({
            container: mapConfig.containerId, // container ID
            style: 'mapbox://styles/mapbox/' + mapConfig.style, // style URL
            center: mapConfig.center, // starting position [lng, lat]
            zoom: mapConfig.zoom, // starting zoom
        });
}

/***
 * geocode is a method to search for coordinates based on a physical address and return
 * @param {string} search is the address to search for the geocoded coordinates
 * @param {string} token is your API token for MapBox
 * @returns {Promise} a promise containing the latitude and longitude as a two element array
 *
 * EXAMPLE:
 *
 *  geocode("San Antonio", API_TOKEN_HERE).then(function(results) {
 *      // do something with results
 *  })
 *
 */
function geocode(search, token) {
    const baseUrl = 'https://api.mapbox.com';
    const endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(`${baseUrl}${endPoint}${encodeURIComponent(search)}.json?access_token=${token}`)
        .then( res => res.json() )
        // to get all the data from the request, comment out the following three lines...
        .then( data => data.features[0].center);
}


/***
 * reverseGeocode is a method to search for a physical address based on inputted coordinates
 * @param {object} coordinates is an object with properties "lat" and "lng" for latitude and longitude
 * @param {string} token is your API token for MapBox
 * @returns {Promise} a promise containing the string of the closest matching location to the coordinates provided
 *
 * EXAMPLE:
 *
 *  reverseGeocode({lat: 32.77, lng: -96.79}, API_TOKEN_HERE).then(function(results) {
 *      // do something with results
 *  })
 *
 */
function reverseGeocode(coordinates, token) {
    const baseUrl = 'https://api.mapbox.com';
    const endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(`${baseUrl}${endPoint}${coordinates.lng},${coordinates.lat}.json?access_token=${token}`)
        .then( res => res.json() )
        // to get all the data from the request, comment out the following three lines...
        .then( data => data.features[0].place_name );
}