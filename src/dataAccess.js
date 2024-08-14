/*
* This file should contain all the code that interacts with data storage
* */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
// import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './keys.js';
// import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getFirestore, collection, doc, getDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

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

export const getVenue = async venueId => {
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
    const docRef = doc(db, 'genres', genreId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// genreId and selectedYear must be integers
export const getVenuesForYearAndGenre = async (genreId, selectedYear) => {
    const allDataForGenre = await fetchGenre(genreId);
    let venuesForSelectedYearAndGenre;
    for (const year of allDataForGenre['years']){
        if (year['id'] === selectedYear){
            venuesForSelectedYearAndGenre = year['venues'];
        }
    }
    return venuesForSelectedYearAndGenre;
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