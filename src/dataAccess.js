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

export const fetchData = async () => {
    const venues = await fetch('http://localhost:3001/years');
    return await venues.json();
}

export const fetchYearLocal = async (year) => {
    const venue = await fetch(`http://localhost:3001/years/${year}`);
    return await venue.json();
}

export const fetchYear = async (year) => {
    const docRef = doc(db, 'years', year);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

export const fetchGenreDataLocal = async () => {
    const genreInfo = await fetch('http://localhost:3001/genres');
    return await genreInfo.json();
}

export const fetchGenreData = async () => {
    const querySnapshot = await getDocs(collection(db, 'genres'));
    const genres = [];
    querySnapshot.forEach(genre => genres.push(genre.data()));
    return genres;
}

export const fetchGenreLocal = async (genreId) => {
    const genreData = await fetch(`http://localhost:3001/genres/${genreId}`);
    return await genreData.json();
}

export const fetchGenre = async (genreId) => {
    genreId = genreId.toString();
    const docRef = doc(db, 'genres', genreId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// genreId and selectedYear must be integers
export const getVenuesForYearAndGenre = async (genreId, selectedYear) => {
    console.log('getVenuesForYearAndGenre triggered');
    const allDataForGenre = await fetchGenre(genreId);
    // console.log(allDataForGenre);
    let venuesForSelectedYearAndGenre;
    for (const year of allDataForGenre['years']){
        // console.log('starting loop');
        // console.log(year);
        // console.log(selectedYear, typeof(selectedYear), year['id'], typeof year['id'])
        if (year['id'] === selectedYear){
            venuesForSelectedYearAndGenre = year['venues'];
        }
    }
    // console.log(venuesForSelectedYearAndGenre)
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