/*
* This file should contain all the code that interacts with data storage
* */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
// import { initializeApp } from 'firebase/app';
import {FIREBASE_CONFIG} from './keys.js';
// import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

initializeApp(FIREBASE_CONFIG);
const db = getFirestore();

/*=== JSON SERVER METHODS ===*/
/*
* These methods are for retrieving data from
* a db.json file stored locally
* using the json-server dependency
* */

export const fetchYearsDataLocal = async () => {
    const venues = await fetch('http://localhost:3001/years');
    return await venues.json();
}

export const fetchYearLocal = async (year) => {
    const venue = await fetch(`http://localhost:3001/years/${year}`);
    return await venue.json();
}

export const fetchGenreDataLocal = async () => {
    const genreInfo = await fetch('http://localhost:3001/genres');
    return await genreInfo.json();
}

export const fetchGenreLocal = async (genreId) => {
    const genreData = await fetch(`http://localhost:3001/genres/${genreId}`);
    return await genreData.json();
}

// genreId and selectedYear must be integers
export const getConcertsForYearAndGenreLocal = async (genreId, selectedYear) => {
    const allDataForGenre = await fetchGenreLocal(genreId);
    /*
    * There are always 40 elements in the years array for any given genre
    * They are always 1970-2009, starting at index 0
    * Therefore, for any given year, the index is the year minus 1970
    * */
    const selectedYearIndex = selectedYear - 1970;
    return allDataForGenre['years'][selectedYearIndex];
}

export const getVenueLocal = async venueId => {
    const venueInfo = await fetch(`http://localhost:3001/venues/${venueId}`);
    return await venueInfo.json();
}

/*====  FIRESTORE METHODS ==========*/

export const fetchYear = async (year) => {
    const docRef = doc(db, 'years', year);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const fetchGenreData = async () => {
    const querySnapshot = await getDocs(collection(db, 'genres'));
    const genres = [];
    querySnapshot.forEach(genre => genres.push(genre.data()));
    return genres;
}

export const fetchGenre = async (genreId) => {
    genreId = genreId.toString();
    const querySnapshot = await getDocs(collection(db, 'genres', genreId, "years"));
    const years = [];
    querySnapshot.forEach(year => years.push(year.data()));
    return years;
}

export const fetchGenreYear = async (genreId, year) => {
    genreId = genreId.toString();
    year = year.toString();
    const docRef = doc(db, 'genres', genreId, 'years', year);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const getVenueData = async () => {
    const querySnapshot = await getDocs(collection(db, 'venues'));
    const venues = [];
    querySnapshot.forEach(venue => venues.push(venue.data()));
    return venues;
}

export const getVenue = async venueId => {
    venueId = venueId.toString();
    const docRef = doc(db, 'venues', venueId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// genreId and selectedYear must be integers
export const getConcertsForYearAndGenre = async (genreId, selectedYear) => {
    return await fetchGenreYear(genreId, selectedYear);
}

export const fetchGenreConcertsInYearRange = async (genreId, startYear, endYear) => {
    const concerts = [];
    for (let i = startYear; i <= endYear; i++){
        const yearConcerts = await fetchGenreYear(genreId, i);
        concerts.push(...yearConcerts.concerts);
    }
    return concerts;
}

export const getGenreId = async genreName => {
    const genreData = await fetchGenreData();
    for (const genre of genreData){
        if (genre['name'] === genreName){
            return genre['id'];
        }
    }
    return undefined;
}

/*============= REDIS METHODS ===================*/

// Requests go to an Express JS API
const expressAddress = "localhost";
const expressPort = 3600;
const protocol = 'http';
const API_ADDRESS = `${protocol}://${expressAddress}:${expressPort}`;

/*
* General method for retrieving all the data at any given key
* Use for years data as follows: fetchData('years')
* Can be used for genres data as follows: fetchData('genres')
* May also be used to retrieve all venues
* */
export const fetchData = async key => {
    try {
        const response = await fetch(`${API_ADDRESS}/json/${key}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Problem with fetch operation:", error);
    }
}

// Function to retrieve data for a specific year
// This accepts a numeric value
// Usage: fetchYearRedis(1978)
// export const fetchYear = async year => {
//     try {
//         const response = await fetch(`${API_ADDRESS}/years/${year}`);
//         const data = await response.json();
//         console.log(data);
//         return data[0];
//     } catch (error) {
//         console.error("Problem with fetch operation:", error);
//     }
// }

// Function to retrieve all genre data at once
// Duplicates fetchData('genres')
// export const fetchGenreData = async () => {
//     try {
//         const response = await fetch(`${API_ADDRESS}/json/genres`);
//         const genres = await response.json();
//         console.log(genres);
//         return genres['genres'];
//     } catch (error) {
//         console.error("Problem fetching genres:", error);
//     }
// }

// Get data for a specific year for a specific genre
// Accepts a string and a number
// export const fetchGenreYear = async (genreId, year) =>{
//     try {
//         const response = await fetch(`${API_ADDRESS}/genres/${genreId}/${year}`);
//         const genreYear = await response.json();
//         console.log(genreYear);
//         return genreYear[0];
//     } catch (error) {
//         console.error("Problem fetching genre-year:", error);
//     }
// }

// Get concert data for a range of years all at once
// export const fetchGenreConcertsInYearRange = async (genreId, startYear, endYear) => {
//     try {
//         const response = await fetch(`${API_ADDRESS}/genres/${genreId}/from/${startYear}/to/${endYear}`);
//         return await response.json();
//     } catch (error){
//         console.error("Problem fetching concerts in year range", error);
//     }
// }

// Function to get data for a specific venue by its id
// export const getVenue = async venueId => {
//     try {
//         const response = await fetch(`${API_ADDRESS}/venues/${venueId}`);
//         const venue = await response.json();
//         return venue[0];
//     } catch (error) {
//         console.error("Problem fetching venue:", error);
//     }
// }

