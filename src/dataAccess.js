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

export const fetchGenreData = async () => {
    const genreInfo = await fetch('http://localhost:3001/genres');
    return await genreInfo.json();
}

export const fetchGenre = async (genreId) => {
    const genreData = await fetch(`http://localhost:3001/genres/${genreId}`);
    return await genreData.json();
}

// genreId and selectedYear must be integers
export const getVenuesForYearAndGenre = async (genreId, selectedYear) => {
    const allDataForGenre = await fetchGenre(genreId);
    console.log(allDataForGenre);
    let venuesForSelectedYearAndGenre;
    for (const year of allDataForGenre['years']){
        console.log('starting loop')
        console.log(year);
        if (year['id'] === selectedYear){
            venuesForSelectedYearAndGenre = year['venues'];
        }
    }
    console.log(venuesForSelectedYearAndGenre)
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