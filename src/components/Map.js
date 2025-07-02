import { useRef, useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "../css/Map.css";
import access_token from './keys.js';
import ConcertsContext from "../context/ConcertsContext.js";
import AnimationContext from "../context/AnimationContext.js";
import { outputVenuesToMap, removeMarkers, removePopups } from "../utils/mapUtils.js";


function Map({ venues }){
    const mapRef = useRef();
    const mapContainerRef = useRef();

    const { setMapContainer, setSelectedVenue, setHoveredMarkerVenueId} = useContext(ConcertsContext);
    const { genreConcerts, genreConcertIndex } = useContext(AnimationContext);

    useEffect(() => {
        mapboxgl.accessToken =
            access_token;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/outdoors-v12",
            center: [-98.48725, 29.44879],
            zoom: 10,
        });

        mapRef.current.reuseMaps = true;

        setMapContainer(mapContainerRef.current);

        return () => {
            mapRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (mapRef.current && venues?.length > 0) {
           removeMarkers();
           removePopups();
           outputVenuesToMap(mapRef.current, venues, setSelectedVenue, setHoveredMarkerVenueId);
        }
    }, [venues]);

    useEffect(() => {
        if (mapRef.current && genreConcerts?.length > 0) {
            const concert = genreConcerts[genreConcertIndex];
            console.log(concert);
        }
    }, [genreConcertIndex]);

    return <div id="map" ref={mapContainerRef} />;
}

export default Map;