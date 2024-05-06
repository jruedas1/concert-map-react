## Venues Data

For the map data, the start point was a list of venues with addresses, derived from an Excel document. This was first converted to JSON. A JavaScript script was used to connect to the MapBox API in order to obtain missing coordinates. The result was the file called `venues.json`. A unique id was added for each venue, which was not in the original source data. This file was converted to a csv, `venues.csv`, using the `json_to_csv` method in the DataWrangler class. To run this method, be sure to import the class: `from data_wrangler import DataWrangler as dw`, then run it using dot notation: `dw.json_to_csv('venues.json', 'venues.csv')`.

## Concert Data

For concert data, the start point was a worksheet in the master Excel file, called `Venue_Artist_Event`. This file had the following headers: Month, Day, Year, Venue, Event_Artists, Artist_Formula, Event_Formulas, and Index. The worksheet distinguishes between, on the one hand, an event -- named by the Event_Formula and in which there were multiple artists, listed in Event_Artists -- and, on the other hand, the individual artist doing a show at the event. Each event has a unique index, but each individual show did not.

The worksheet was exported from Excel as a csv file called `venue_artist_event.csv`. This csv file contains concert information from 1857 to 2023. This csv file was converted to json using the DataWrangler's `csv_to_json` method. The resulting file was then processed to remove all concerts outside the specified range of 1970-2009. The `filter_json_by_year_range` method in the DataWrangler was used for this purpose. After processing `venue_artist_event.csv` using `csv_to_json` and `filter_json_by_year_range`, we need to add one more step. Each event should have a unique id. For this purpose the `add_unique_id_to_dicts` method was used. The resulting file after these three steps of processing was named `events.json`.

## Years -> Venues -> Events JSON

The application allows users to retrieve data on concerts in San Antonio in any given year. For any given year, the application displays the venues that held concerts that year. When the user clicks on a venue, the app displays the concerts in that venue that year. To facilitate data retrieval, at this point we combine our venues and events files into one file called `years.json`. To do this, run the DataWrangler `create_years_json` method. This method takes an events file and a venues file and combines them into one json file, which should be called something like `years_venues_events.json`.

## Handling Genre Data

The source Excel sheet has a worksheet called `artistsGenre` that associates multiple genres to each artist. This worksheet is exported as a csv. In addition, there is a JSON file derived from API requests to the wikimedia API as well as web scraping Wikipedia. This file is called `wiki_artist_genres.json`. These two files are combined into a single JSON file called `artist_genres.json` using the DataWrangler `merge_csv_and_json` method. 

