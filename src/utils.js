export const findMatchesInArray = (string, array) => {
    return array.filter(el => el.toLowerCase().includes(string.toLowerCase()));
}