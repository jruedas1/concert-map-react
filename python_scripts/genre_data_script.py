# This code is used to generate the genres object in the db.json file
# It requires two sources of data.
#
# One source should be a json file with a single item, "years",
# in which years is an array of objects. Each object has an id property, which is the
# year in question, and a venues property, which is a list of venue objects. Each
# venue object has a concerts property that is an array of concert objects.
#
# The second source of data is also json, it is an object in which the keys are names
# of artists and the values are arrays of genres.

import json

# change the names of these files as needed
year_venue_concert_data = 'db.json'
artist_genre_data = 'artist_genres.json'

with open(year_venue_concert_data) as db_json:
    all_data = json.load(db_json)

with open('artist_genres.json') as ag:
    artists_genres = json.load(ag)

genre_to_artists = {}
for artist, genres in artists_genres.items():
    for genre in genres:
        genre_lower = genre.lower()
        if genre_lower not in genre_to_artists:
            genre_to_artists[genre_lower] = []
        genre_to_artists[genre_lower].append(artist)

# Generate the desired data structure
result = {}
# Here we have a list of genres with their associated artists
for genre, artists in genre_to_artists.items():
    # print(genre, artists)
    result[genre] = {"years": []}
    # for each genre we create an empty list
    # now we loop over each year in the data
    # in other words, for every genre, it loops over all the years in the data
    for year_data in all_data["years"]:
        # for every year, it grabs the year id,
        # which is the year identifier (1970, 1971, etc.)
        year = year_data["id"]
        # now it creates an empty venues list
        venues = []
        # now it loops over that year's venues
        for venue_data in year_data["venues"]:
            # it creates an empty list for the concerts in that venue
            venue_concerts = []
            for concert in venue_data["concerts"]:
                if concert["Artist_Formula"] in artists:
                    venue_concerts.append(concert)
            if venue_concerts:
                venue_data_copy = venue_data.copy()
                venue_data_copy["concerts"] = venue_concerts
                venues.append(venue_data_copy)
        if venues:
            result[genre]["years"].append({"id": year, "venues": venues})

# change the name of the output file as needed
with open('new_json.json', 'w') as f:
    json.dump(result, f, indent=4)



