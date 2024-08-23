export const findMatchesInArray = (string, array) => {
    return array.filter(el => el.toLowerCase().includes(string.toLowerCase()));
}

export const capitalizeWords = string => {
    const stringArr = string.split(' ');
    const capitalized = stringArr.map(word => word[0].toUpperCase() + word.substring(1));
    let capitalizedString = capitalized.join(' ');
    if (capitalizedString.includes('/')) capitalizedString = capitalizedString.split('/').map(term => term[0].toUpperCase() + term.substring(1)).join('/');
    if (capitalizedString.includes('&')) capitalizedString = capitalizedString.split('&').map(term => term[0].toUpperCase() + term.substring(1)).join('&');
    return capitalizedString;
}