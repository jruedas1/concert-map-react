export const fetchVenues = async () => {
    const venues = await fetch('http://localhost:3001/venues');
    return await venues.json();
}

export const fetchVenue = async (id) => {
    const venue = await fetch(`http://localhost:3001/venues/${id}`);
    return await venue.json();
}

export const updateVenue = async (id, venue) => {
    try {
        const url = `http://localhost:3001/venues/${id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venue)
        };
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}