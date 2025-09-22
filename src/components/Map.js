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
import ProgressBar from "./ProgressBar";
import YearDisplay from "./YearDisplay";


function Map({ venues }){
    const mapRef = useRef();
    const mapContainerRef = useRef();

    const { setMapContainer, setSelectedVenue, setHoveredMarkerVenueId, confirmedYear} = useContext(ConcertsContext);
    const { genreConcerts, genreConcertIndex, uniqueVenues, isAnimating, markersRef } = useContext(AnimationContext);

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
            const venueId = concert["venue_id"];
            const venue = uniqueVenues[venueId];
            const venueMarker = findMarkerById(mapRef.current, venueId);
            findAndDeHighlightMarkers(mapRef.current);
            if (!venueMarker) {
                const marker = outputVenueToMap(mapRef.current, venue, setSelectedVenue, setHoveredMarkerVenueId);
                if (marker){
                    if (isAnimating){
                        marker.getElement().classList.add('disabled');
                        marker._popup._classList.add('hidden');
                    }
                    markersRef.current.push(marker);
                }
            }
            findAndHighlightMarker(mapRef.current, venueId);
        }
    }, [genreConcertIndex]);

    useEffect(() => {
        if (!isAnimating) {
            markersRef.current.forEach(marker => {
                marker._popup._classList.delete('hidden');
                marker.getElement().classList.remove('disabled');
            });
        }
    }, [isAnimating]);

    return (
        <div
            id="map"
            className={`${!confirmedYear ? "mobile-hidden" : ''}`}
            ref={mapContainerRef}
        >
            <YearDisplay />
            <ProgressBar className="progress-bar" />
        </div>

    );
}

export default Map;