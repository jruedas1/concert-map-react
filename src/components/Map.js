import { useRef, useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "../css/Map.css";
import access_token from './keys.js';
import ConcertsContext from "../context/ConcertsContext.js";
import AnimationContext from "../context/AnimationContext.js";
import ViewportContext from "../context/ViewportContext";
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


function Map({ venues, interactionMode }){
    const mapRef = useRef();
    const mapContainerRef = useRef();

    const { setMapContainer, selectedVenue, setSelectedVenue,
        setHoveredMarkerVenueId, confirmedYear,
    } = useContext(ConcertsContext);
    const { genreConcerts, genreConcertIndex, uniqueVenues, isAnimating, markersRef, progress } = useContext(AnimationContext);
    const { view, isMobile, singleVenueMode, setSingleVenueMode } = useContext(ViewportContext);

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
           outputVenuesToMap(mapRef.current,
               venues,
               setSelectedVenue,
               setHoveredMarkerVenueId,
               isMobile,
               setSingleVenueMode);
        }
    }, [venues]);

    useEffect(() => {
        if (mapRef.current && genreConcerts?.length > 0) {
            const concert = genreConcerts[genreConcertIndex];
            const venueId = concert.properties? concert.properties.venue_id : concert["venue_id"];
            if (!venueId) {
                console.warn("Concert missing venue_id: ", concert);
                return;
            }
            const venue = uniqueVenues[venueId];
            const venueMarker = findMarkerById(mapRef.current, venueId);
            findAndDeHighlightMarkers(mapRef.current);
            if (!venueMarker) {
                const marker = outputVenueToMap(mapRef.current,
                    venue,
                    setSelectedVenue,
                    setHoveredMarkerVenueId,
                    isMobile,
                    setSingleVenueMode
                    );
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

    useEffect(() => {
        if (mapRef.current && confirmedYear) {
            // Wait one tick so CSS has applied
            setTimeout(() => {
                mapRef.current.resize();
            }, 100);
        }
    }, [confirmedYear, view]);

    // for explore mode mobile
    useEffect(() => {
        const map = mapRef.current;
        const observer = new MutationObserver(() => {
            if (mapContainerRef.current.offsetParent !== null) {
                map.resize();
            }
        });
        observer.observe(mapContainerRef.current, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);


    return (
        <div
            id="map"
            className={`${
                view==="list" ||
                (interactionMode === "search" && !confirmedYear) || 
                (isMobile && selectedVenue && !singleVenueMode) ||
                (interactionMode === "explore" && genreConcerts.length === 0)
                    ? "mobile-hidden" : ''}`}
            ref={mapContainerRef}
        >
            <YearDisplay />
            <ProgressBar className="progress-bar" />
        </div>

    );
}

export default Map;