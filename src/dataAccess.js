// Requests go to an Express JS API

// Remote:
const expressAddress = "dev.cedish.utsa.edu/devconcerts-api";
const expressPort = 7860;
const protocol = 'https';
const API_ADDRESS = `${protocol}://${expressAddress}`;

// local
// const expressAddress = "localhost";
// const expressPort = 7860;
// const protocol = 'http';
// const API_ADDRESS = `${protocol}://${expressAddress}:${expressPort}`;

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
// Usage: fetchYear(1978)
export const fetchYear = async year => {
    try {
        const response = await fetch(`${API_ADDRESS}/years/${year}`);
        const data = await response.json();
        console.log(data);
        return data[0];
    } catch (error) {
        console.error("Problem with fetch operation:", error);
    }
}

// Function to retrieve all genre data at once
// Duplicates fetchData('genres')
export const fetchGenreData = async () => {
    try {
        const response = await fetch(`${API_ADDRESS}/json/genres`);
        const genres = await response.json();
        console.log(genres);
        return genres['genres'];
    } catch (error) {
        console.error("Problem fetching genres:", error);
    }
}

// Get data for a specific year for a specific genre
// Accepts a string and a number
export const fetchGenreYear = async (genreId, year) =>{
    try {
        const response = await fetch(`${API_ADDRESS}/genres/${genreId}/${year}`);
        const genreYear = await response.json();
        console.log(genreYear);
        return genreYear[0];
    } catch (error) {
        console.error("Problem fetching genre-year:", error);
    }
}

// Get concert data for a range of years all at once
export const fetchGenreConcertsInYearRange = async (genreId, startYear, endYear) => {
    try {
        const response = await fetch(`${API_ADDRESS}/genres/${genreId}/from/${startYear}/to/${endYear}`);
        return await response.json();
    } catch (error){
        console.error("Problem fetching concerts in year range", error);
    }
}

export const getConcertsForYearAndGenre = async (genreId, selectedYear) => {
     return await fetchGenreYear(genreId, selectedYear);
 }

// Function to get data for a specific venue by its id
export const getVenue = async venueId => {
    try {
        const response = await fetch(`${API_ADDRESS}/venues/${venueId}`);
        const venue = await response.json();
        return venue[0];
    } catch (error) {
        console.error("Problem fetching venue:", error);
    }
}