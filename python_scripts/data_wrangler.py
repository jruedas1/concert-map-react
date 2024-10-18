import json
import csv
from collections import defaultdict
from datetime import datetime

from setuptools.dist import single_line


class DataWrangler:

    @classmethod
    def flatten_dict_values(cls, d):
        for value in d.values():
            for item in value:
                yield item

    # Take a dictionary and return a list based on its values
    @classmethod
    def flatten_dictionary(cls, dictionary):
        return list(cls.flatten_dict_values(dictionary))

    # convert JSON to Excel-style CSV
    # this will put the columns in the order in which the dictionary values
    # are in the first dictionary in the JSON file
    @classmethod
    def json_to_csv(cls, json_file, destination_csv_file):
        # open the JSON file and load the data
        with open(json_file) as f:
            data = json.load(f)

        header_keys = list(data[0].keys())

        # open the csv in write mode
        with open(destination_csv_file, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            # write the header row
            writer.writerow(header_keys)
            # write the data rows
            for row in data:
                mapped_row = [row[key] for key in header_keys]
                writer.writerow(mapped_row)

    # this method takes a csv file and outputs a prettified json file
    # it goes through the list and removes byte order marks before output
    @classmethod
    def csv_to_json(cls, input_file, output_file):

        with open(input_file) as csv_file:
            reader = csv.DictReader(csv_file)
            data = [row for row in reader]

        for d in data:
            # Modify the dictionary in place to strip BOM from keys
            # Use list(d.keys()) to avoid RuntimeError for modifying a dictionary while iterating
            for key in list(d.keys()):
                d[key.replace('\ufeff', '')] = d.pop(key)

        with open(output_file, 'w') as json_file:
            json.dump(data, json_file, indent=4)

    # this will take a JSON file (a list of dictionaries)
    # and will change a key in every dictionary in the list
    @classmethod
    def change_key(cls, data_source_file, old_key, new_key, destination_file):
        with open(data_source_file) as f:
            data = json.load(f)

        for item in data:
            item[new_key] = item.get(new_key, item.pop(old_key, None))

        with open(destination_file, 'w') as df:
            json.dump(data, df)

    @classmethod
    def prettify_json_file(cls, input_file, output_file):
        # Read the JSON data from the file
        with open(input_file, 'r', encoding='utf-8') as file:
            json_string = file.read()

        # Parse the JSON data into a Python object
        data = json.loads(json_string)

        # Write the prettified JSON data to a new file
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)

    # Takes a list of dictionaries containing a "Year" property and filters out all those
    # outside the specified range
    @classmethod
    def filter_json_by_year_range(cls, input_file, start_year, end_year, output_file):
        # Load the JSON data from the input file
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Filter the data based on the year range, handling missing or invalid years
        filtered_data = []
        for item in data:
            if 'Year' in item and item['Year']:  # Check if 'Year' key exists and is not empty
                try:
                    year = int(item['Year'])
                    if start_year <= year <= end_year:
                        filtered_data.append(item)
                except ValueError:
                    # Handle cases where 'Year' is not a valid integer
                    print(f"Skipping item due to invalid 'Year' value: {item}")

        # Write the filtered data to a new file
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(filtered_data, file, indent=4)

    # Adds a unique id to every dictionary in a JSON file
    @classmethod
    def add_unique_id_to_dicts(cls, input_file, output_file):
        # Load the JSON data from the input file
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Add unique IDs to each dictionary
        for i, item in enumerate(data, start=1):  # start=1 to make the first ID 1 instead of 0
            item['id'] = i

        # Write the modified data to a new file
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)

    @classmethod
    def create_years_json(cls, events_file, venues_file, output_file):

        # Reading data from venues.json
        with open(venues_file, 'r') as venues_fh:
            venues_json = venues_fh.read()

        # Reading data from events.json
        with open(events_file, 'r') as events_fh:
            events_json = events_fh.read()

        venues = json.loads(venues_json)
        events = json.loads(events_json)

        combined_data = {}

        # Iterate through events and match venues based on names
        for event in events:
            year = event['Year']
            venue_name = event['Venue']
            matching_venue = None

            for venue in venues:
                if venue['name'] == venue_name:
                    matching_venue = venue
                    break

            if matching_venue:
                venue_id = int(matching_venue['id'])
                if year not in combined_data:
                    combined_data[year] = {}
                if venue_id not in combined_data[year]:
                    combined_data[year][venue_id] = {
                        'concerts': [],
                        'name': matching_venue['name'],
                        'city': matching_venue['city'],
                        'address': matching_venue['address'],
                        'zip': matching_venue['zip'],
                        'longitude': matching_venue['longitude'],
                        'latitude': matching_venue['latitude'],
                        'state': matching_venue['state'],
                        'id': venue_id
                    }
                combined_data[year][venue_id]['concerts'].append(event)

        # Reformat data into the desired structure with numeric ids
        output_years = []
        for year, venues_data in combined_data.items():
            venues = []
            for venue_id, venue_info in venues_data.items():
                concerts = venue_info.pop('concerts')
                venues.append({
                    **venue_info,
                    'concerts': concerts
                })
            output_years.append({
                'id': int(year),
                'venues': venues
            })

        output = {'years': output_years}

        # Writing output to a file called output.json
        with open(output_file, 'w') as output_fh:
            json.dump(output, output_fh, indent=4)

        print(f"Data has been written to {output_file}")

    # This method is used to merge a csv file from the source Excel document
    # containing associations of artists with individual genres,
    # with a json file containing associations of artists with lists of genres
    @classmethod
    def merge_csv_and_json(cls, csv_file, json_file, output_file):
        # Function to merge genres from both lists while considering case-insensitivity
        def merge_genres(genres_csv, genres_json):
            combo = set(genres_csv)
            for genre in genres_json:
                if genre.lower() not in map(str.lower, genres_csv):
                    combo.add(genre)
            return list(combo)

        # Load genres from JSON file
        with open(json_file, 'r', encoding='utf-8') as f:
            artists_genres_json = json.load(f)

        artists = {}
        with open(csv_file, newline='', encoding='utf-8-sig') as csvfile:  # Use utf-8-sig to ignore BOM
            reader = csv.DictReader(csvfile)
            for row in reader:
                artist_id = int(row['artistIndex'])
                name = row['Name']  # No need to handle BOM here
                genres = row['Genres'].split(',')  # Split genres by comma
                if name in artists:
                    artists[name]["genres"].extend(genres)
                else:
                    artists[name] = {
                        "id": artist_id,
                        "artist": name,
                        "genres": genres
                    }

        # Merge genres from JSON file
        for artist, entry in artists.items():
            if artist in artists_genres_json:
                entry["genres"] = merge_genres(entry["genres"], artists_genres_json[artist])

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(list(artists.values()), f, indent=4)

        print("Merged genres saved to:", output_file)

    # this method works on a json file containing key-value pairs of
    # artists and lists of genres and extracts a list of unique genres
    @classmethod
    def derive_unique_genres_list(cls, genres_artists_json_file, output_file):
        unique_genres = set()
        with open(genres_artists_json_file) as genres_file:
            artists_genres = json.load(genres_file)
            for artist_dict in artists_genres:
                for genre in artist_dict['genres']:
                    unique_genres.add(genre.lower().strip())

        unique_genres = {
            "unique_genres": list(unique_genres)
        }

        with open(output_file, 'w') as of:
            json.dump(unique_genres, of, indent=4)

    # utility method
    # searches a list of dictionaries for one with a particular value for a specific key
    @classmethod
    def find_dict_by_key_value(cls, list_of_dicts, key_to_find, value_to_find):
        for dictionary in list_of_dicts:
            if dictionary.get(key_to_find) == value_to_find:
                return dictionary
        return None

    # generates a genres hierarchy in which a few major genres have one subgenre
    # specific to this project. Searches for string matches. Does some extra work
    # for tejano and r&b
    @classmethod
    def generate_genres_hierarchy(cls, unique_genres_json_file, master_genres_list, output_file):
        genres_and_subgenres_list = []
        with open(unique_genres_json_file) as genre_file:
            genre_list = json.load(genre_file)
            genre_list = genre_list['unique_genres']
            genre_id = 1
            for master_genre in master_genres_list:
                matches = [genre for genre in genre_list if master_genre in genre]

                genres_and_subgenres_list.append({
                    "id": genre_id,
                    "genre": master_genre,
                    "subgenres": matches
                })
                genre_id += 1
            # tex-mex and conjunto variation
            tejano_dictionary = DataWrangler.find_dict_by_key_value(genres_and_subgenres_list, 'genre', 'tejano')
            tejano_matches = [genre for genre in genre_list if 'tex-mex' in genre or 'conjunto' in genre]
            for match in tejano_matches:
                tejano_dictionary['subgenres'].append(match)

            # rhythm and blues variation
            randb_dictionary = DataWrangler.find_dict_by_key_value(genres_and_subgenres_list, 'genre', 'r&b')
            print(randb_dictionary)
            randb_matches = [genre for genre in genre_list if 'rhythm and blues' in genre]
            for match in randb_matches:
                randb_dictionary['subgenres'].append(match)

            genres_and_subgenres = {
                "genres_and_subgenres": genres_and_subgenres_list
            }

        with open(output_file, 'w') as of:
            json.dump(genres_and_subgenres, of, indent=4)

    @classmethod
    def generate_db_json(cls, years_json, genres_json, venues_json, output_file):

        with open(years_json) as years:
            years_data = json.load(years)

        with open(genres_json) as genres:
            genres_data = json.load(genres)

        with open(venues_json) as venues:
            venues_data = json.load(venues)

        db_json = {
            "years": years_data["years"],
            "genres": genres_data,
            "venues": venues_data
        }

        with open(output_file, 'w') as f:
            json.dump(db_json, f, indent=4)

    @classmethod
    def generate_genres_years_concerts(cls, genre_hierarchy_file, artists_and_genres_file, year_venues_file,
                                       output_file):
        # We are going to use this function when we sort concerts chronologically
        # It's specific to this particular context, so we are defining it in this method
        def convert_to_datetime(concert_dict):
            date_str = f"{concert_dict['Year']}-{concert_dict['Month']}-{concert_dict['Day']}"
            return datetime.strptime(date_str, "%Y-%B-%d")

        # Loading data from files
        with open(genre_hierarchy_file) as f:
            genre_hierarchy = json.load(f)

        with open(artists_and_genres_file) as f:
            artists_and_genres = json.load(f)

        with open(year_venues_file) as f:
            years_venues = json.load(f)

        output = []

        for genre in genre_hierarchy["genres_and_subgenres"]:
            print(genre)
            genre_info = {
                "id": genre["id"],
                "name": genre["genre"],
                "years": []
            }
            # lower-case all the subgenres for comparison with the artist genres
            subgenres_lc = [subgenre.lower() for subgenre in genre["subgenres"]]

            # loop over the years
            for year in years_venues["years"]:
                # in each year, loop over the venues
                year_info = {"id": year["id"], "concerts": []}
                # Create a set to track concert ids to avoid duplicates
                added_concert_ids = set()
                for venue in year["venues"]:
                    # in each venue, loop over the concerts
                    for concert in venue['concerts']:
                        # extract and save the concert artist name
                        concert_artist_name = concert['Artist_Formula']
                        # now loop over the artists listed in the artists and genres list
                        for artist in artists_and_genres:
                            # find the artist in the list of artists with their genres
                            if artist["artist"].lower() == concert_artist_name.lower():
                                # loop over the artist's genres
                                for artist_genre in artist["genres"]:
                                    # if the genre in question is one of the subgenres
                                    # that pertains to the genre we are currently examining
                                    if artist_genre.lower() in subgenres_lc:
                                        # check if the concert ID has already been added
                                        concert_id = concert["id"]
                                        if concert_id not in added_concert_ids:
                                            # mark the concert as added
                                            added_concert_ids.add(concert_id)
                                            # we need to tack on some info about the venue:
                                            # the venue id will be used to find the map marker
                                            concert["venue_id"] = venue["id"]
                                            # the venue coords may be useful for output purposes
                                            concert["venue_coords"] = [venue["longitude"], venue["latitude"]]
                                            # add it to the genre's concert list for that year
                                            year_info["concerts"].append(concert)
                # Before proceeding we have to sort the concerts chronologically
                sorted_concerts = sorted(year_info["concerts"], key=convert_to_datetime)
                year_info["concerts"] = sorted_concerts
                # when you're done building up the list of concerts for that year
                # attach the year to that genre's info
                genre_info["years"].append(year_info)
                genre_info["years"].sort(key=lambda year_data: year_data["id"])
            # tack the whole genre with its concerts onto the output list
            output.append(genre_info)

        # Output the final JSON
        with open(output_file, 'w') as f:
            json.dump(output, f, indent=4)



