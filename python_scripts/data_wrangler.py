import json
import csv


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
    def generate_genres_years_json(cls, year_venue_concert_json, artists_genres_json, genres_subgenres_json, master_genres_list, output_file):

        with open(year_venue_concert_json) as yvcjson:
            year_venue_concert_data = json.load(yvcjson)

        with open(artists_genres_json) as agjson:
            artists_genres = json.load(agjson)

        with open(genres_subgenres_json) as gsjson:
            genres_subgenres = json.load(gsjson)

        genres_and_artists = {}

        for genre in master_genres_list:
            genres_and_artists[genre] = []

        for artist in artists_genres:
            for genre in artist['genres']:
                genre_lower = genre.lower().strip()
                # search for the genre in the genres/subgenres
                for master_genre in genres_subgenres["genres_and_subgenres"]:
                    for subgenre in master_genre["subgenres"]:
                        if genre_lower == subgenre:
                            if artist["artist"] not in genres_and_artists[master_genre["genre"]]:
                                genres_and_artists[master_genre["genre"]].append(artist["artist"])

        # print(genres_and_artists)
        result = {}
        for genre, artists in genres_and_artists.items():
            result[genre] = {"years": []}
            for year_data in year_venue_concert_data["years"]:
                year = year_data["id"]
                venues = []
                for venue_data in year_data["venues"]:
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

        # # Print the result
        # print(json.dumps(result, indent=4))

        with open(output_file, 'w') as f:
            json.dump(result, f, indent=4)