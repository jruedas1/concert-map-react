This is the companion web application for the "Sounds of San Anto" project.

To get this working on your local machine, you must have Node.js installed on your system. Go to [Node.js](https://nodejs.org) to download and install the appropriate version for your operating system.

Once you have installed node, clone this project. Note that you must have an ssh key registered with GitHub in order to clone projects and carry out other repository operations on your local machine.

You must have an account with Mapbox. Once you have registered with Mapbox, create a secret key. Within the `js` directory of this project, create a file called `keys.js`. In this file, create a variable as follows: `MAPBOX_API_KEY = "your_mapbox_key_here_between_quotes";`. This is necessary in order for the Mapbox API to load.

If you are working in VSCode, you should then open two terminal windows. In one terminal window run `npm run db`. This will activate the json-server mock server, which will serve the concert data. Then in the other terminal window run `npm start`. This will activate the lite server, which should automatically open the `index.html` file on port 10001. The JavaScript code connected to this file will automatically open your default browser and load the index page. 

If this does not work immediately, run `npm install` to install all the dependencies locally, then run the `npm run db` and `npm start` commands again.