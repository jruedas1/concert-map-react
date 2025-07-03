import { useRef, useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "../css/Map.css";
import access_token from './keys.js';
import ConcertsContext from "../context/ConcertsContext.js";
import AnimationContext from "../context/AnimationContext.js";
import { outputVenueToMap,
    outputVenuesToMap,
    removeMarkers,
    removePopups,
    findMarkerById,
    findAndDeHighlightMarkers,
    findAndHighlightMarker
} from "../utils/mapUtils.js";


function Map({ venues }){
    const mapRef = useRef();
    const mapContainerRef = useRef();

    const { setMapContainer, setSelectedVenue, setHoveredMarkerVenueId} = useContext(ConcertsContext);
    const { genreConcerts, genreConcertIndex, uniqueVenues } = useContext(AnimationContext);

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
            console.log(genreConcerts);
            console.log(genreConcertIndex);
            const concert = genreConcerts[genreConcertIndex];
            console.log(concert);
            console.log(concert["venue_id"]);
            const venueId = concert["venue_id"];
            const venue = uniqueVenues[venueId];
            console.log(venue);
            const venueMarker = findMarkerById(mapRef.current, venueId);
            if (venueMarker) findAndHighlightMarker(mapRef.current, venueId);
            if (!venueMarker) {
                const marker = outputVenueToMap(mapRef.current, venue, setSelectedVenue, setHoveredMarkerVenueId);
                findAndDeHighlightMarkers(mapRef.current);
                findAndHighlightMarker(mapRef.current, venueId);
                }
        }
    }, [genreConcertIndex]);

    return <div id="map" ref={mapContainerRef} />;
}

export default Map;