## Venues Data

For the map data, the start point was a list of venues with addresses, derived from an Excel document. This was first converted to JSON. A JavaScript script was used to connect to the MapBox API in order to obtain missing coordinates. The result was the file called `venues.json`. A unique id was added for each venue, which was not in the original source data. This file was converted to a csv, `venues.csv`, using the `json_to_csv` method in the DataWrangler class. To run this method, be sure to import the class: `from data_wrangler import DataWrangler as dw`, then run it using dot notation: `dw.json_to_csv('venues.json', 'venues.csv')`.

## Concert Data

For concert data, the start point was a worksheet in the master Excel file, called `Venue_Artist_Event`. This file had the following headers: Month, Day, Year, Venue, Event_Artists, Artist_Formula, Event_Formulas, and Index. The worksheet distinguishes between, on the one hand, an event -- named by the Event_Formula and in which there were multiple artists, listed in Event_Artists -- and, on the other hand, the individual artist doing a show at the event. Each event has a unique index, but each individual show did not.

The worksheet was exported from Excel as a csv file called `venue_artist_event.csv`. This csv file contains concert information from 1857 to 2023. This csv file was converted to json using the DataWrangler's `csv_to_json` method. The resulting file was then processed to remove all concerts outside the specified range of 1970-2009. The `filter_json_by_year_range` method in the DataWrangler was used for this purpose. After processing `venue_artist_event.csv` using `csv_to_json` and `filter_json_by_year_range`, we need to add one more step. Each event should have a unique id. For this purpose the `add_unique_id_to_dicts` method was used. The resulting file after these three steps of processing was named `events.json`.

## Years -> Venues -> Events JSON

The application allows users to retrieve data on concerts in San Antonio in any given year. For any given year, the application displays the venues that held concerts that year. When the user clicks on a venue, the app displays the concerts in that venue that year. To facilitate data retrieval, at this point we combine our venues and events files into one file called `years.json`. To do this, run the DataWrangler `create_years_json` method. This method takes an events file and a venues file and combines them into one json file, which should be called something like `years_venues_events.json`.

## Handling Genre Data

The source Excel sheet has a worksheet called `artistsGenre` that associates multiple genres to each artist. This worksheet is exported as a csv. In addition, there is a JSON file derived from API requests to the wikimedia API as well as web scraping Wikipedia. This file is called `wiki_artist_genres.json`. These two files are combined into a single JSON file called `artist_genres.json` using the DataWrangler `merge_csv_and_json` method. 

Next, we generate a list of unique genres. This is derived from the `artist_genres.json` file using the DataWrangler `derive_unique_genres` method, and results in a file called `unique_genres.json`. In this list, all genres are lower-cased for easier comparison. We will eventually capitalize correctly for output purposes only, but store lower-cased versions for storage and processing purposes.

The application uses a limited range of genres for search, so the next step is to use these major genres to develop a hierarchy of genres and subgenres. For this purpose, we use the DataWrangler `generate_genres_hierarchy` method. This method takes the unique genres json file, and a list of master genres, and creates a file called `genres_with_subgenres.json`. Note that it is very context-specific and expects that "tejano" and "r&b" are going to be part of its dataset.

We are now in a position to generate the genres JSON that the application will actually draw on when a user selects one of the master genres. For this purpose we use the `generate_genres_years_json` in the DataWrangler. This takes the years_venues_events json, the artist_genres json, the genres_with_subgenres json, and the master genres list, generates the appropriate data structure, and outputs it to a file. We can call this file `genres_years_venues_concerts.json`.

Note that the current master genres list is as follows:

```python
master_genres = ['rock', 'country', 'tejano', 'r&b', 'metal']
```

This should be amended as needed, and corresponding changes made to the `generate_genres_hierarchy` method.

## Assembling the DB.JSON file

Currently, the only search selectors on the application are by years and by genres, so only those json files are included. If the genres associated with any given artist are required, the `artist_genres` JSON may be included.

To generate the `db.json` file, we use the `generate_db_json` method in the DataWrangler. This accepts as inputs the years json and the genres json and combines them into one json file. By convention, this file should be called `db.json`.

## Revised genre data

As of 2024-08-06, the following changes have been made. A revised genre hierarchy has been established with a new master genre list. A new method has been created to generate genre data. For any given genre in any given year, the concert data should be presented chronologically for the entire year independently of location, and not grouped first by location or venue, then chronologically within each venue. The DataWrangler class has accordingly been updated with a new method called `generate_genres_years_concerts` that skips the intermediate step of grouping by venues. It also does not require the master genres list as input, since this can be derived from the genres and subgenres list. It only needs the genres and subgenres list, the list of artists with their associated subgenres, and the list of years with their venues and events. The new file generated by this method forms the new basis for the data visualization of genre concerts.

In addition, the `artists_genres` list has been updated and expanded to include 4152 artists associated with genres.


