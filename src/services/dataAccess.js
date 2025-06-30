

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

export const fetchYear = async year => {
    try {
        const response = await fetch(`${API_ADDRESS}/years/${year}`);
        const data = await response.json();
        console.log(data[0]);
        return data[0];
    } catch (error) {
        console.error("Problem with fetch operation:", error);
    }
}

export const fetchGenreData = async () => {
    try {
        const response = await fetch(`${API_ADDRESS}/json/genres`);
        const genres = await response.json();
        console.log(genres);
        const genreNames = [];
        for (const genre of genres['genres']) {
            genreNames.push({
                id: genre['id'],
                name: genre['name']
            });
        }
        return genreNames;
    } catch (error) {
        console.error("Problem fetching genres:", error);
    }
}