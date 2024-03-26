export const fetchData = async () => {
    const venues = await fetch('http://localhost:3001/years');
    return await venues.json();
}

export const fetchYear = async (year) => {
    const venue = await fetch(`http://localhost:3001/years/${year}`);
    return await venue.json();
}

