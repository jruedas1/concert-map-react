/*
* This file should contain all the code that interacts with data storage
* */

export const fetchData = async () => {
    const venues = await fetch('http://localhost:3001/years');
    return await venues.json();
}

export const fetchYear = async (year) => {
    const venue = await fetch(`http://localhost:3001/years/${year}`);
    return await venue.json();
}

export const fetchGenreData = async() => {
    const genreInfo = await fetch('http://localhost:3001/genres');
    return await genreInfo.json();
}

export const fetchGenre = async(genre) => {
    const allGenreData = await fetchGenreData();
    return allGenreData[genre];
}