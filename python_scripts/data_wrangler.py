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
