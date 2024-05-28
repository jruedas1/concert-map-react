This is the companion web application for the "Sounds of San Anto" project.

To get this working on your local machine, you must have Node.js installed on your system. Go to [Node.js](https://nodejs.org) to download and install the appropriate version for your operating system.

Once you have installed node, clone this project. Note that you must have an ssh key registered with GitHub in order to clone projects and carry out other repository operations on your local machine.

You must have an account with Mapbox. Once you have registered with Mapbox, create a secret key. Within the `js` directory of this project, create a file called `keys.js`. In this file, create a variable as follows: `MAPBOX_API_KEY = "your_mapbox_key_here_between_quotes";`. This is necessary in order for the Mapbox API to load.

If you are working in VSCode, you should then open two terminal windows. In one terminal window run `npm run db`. This will activate the json-server mock server, which will serve the concert data. Then in the other terminal window run `npm start`. This will activate the lite server, which should automatically open the `index.html` file on port 10001. The JavaScript code connected to this file will automatically open your default browser and load the index page. 

If this does not work immediately, run `npm install` to install all the dependencies locally, then run the `npm run db` and `npm start` commands again.

## Firebase Version

A version of this project optimized for use with a Firebase Firestore data store is found in the `firestore` branch. This version incorporates webpack and has a firestore deployment configuration file.

Using Firebase requires installation of the `firebase` node package, and use of webpack requires the `webpack` and `webpack-cli` packages. These have been added to the `package.json` file so that running `npm install` should install these dependencies locally.

The webpack configuration file is `webpack.config.js`. This file configures the entry point for JavaScript bundling and the output file. The entry point is `src/index.js`, while the output file is `dist/main.js`. All JavaScript in this project must go through the `index.js` file, which is the **only** file referenced in `index.html`. Webpack will read the `index.js` file, follow all the dependencies from there, and bundle the code into one file called `main.js`.

Any changes to the JavaScript code here must be processed by webpack before deployment. To bundle the JS code, run `npm run build`. With `watch` set to `true` in the webpack configuration, this command does not need to be rerun every time a change is made.

API keys for Mapbox and Firestore are in a file called `keys.js`. When webpack runs, this file is read and the keys are bundled into the `main.js` file. Because the API keys are in these files, they are both excluded from version control. To make this project work, you must obtain the keys or generate your own, include them in a `keys.js` file, and run webpack to generate a `main.js` file. The structure of the `keys.js` file is as follows:

```js
export const MAPBOX_API_KEY = "this_is_the_mapbox_api_key";

export const FIREBASE_CONFIG =  {
        apiKey: "firebase_api_key",
        authDomain: "projectName.firebaseapp.com",
        projectId: "projectName",
        storageBucket: "projectName.appspot.com",
        messagingSenderId: "senderId",
        appId: "appId"
      };
```

The following files need to be uploaded to a Firestore db for the project to work: `years_venues_events.json` (as the `/years` collection) and `genres_years_venues_concerts.json` (as the `/genres` collection). Currently, a tool called `Firefoo` is being used to upload and convert data.

To deploy a project to a Firebase project account, run `firebase init` and then `firebase deploy --only hosting`.

The Firebase deployment configuration file is `firebase.json`. This determines all the files that do not need to be uploaded for deployment. Note that the JSON files and python scripts should not be deployed as they are not necessary. In addition, the `src` directory has been entirely bundled into the `dist/bundle.js` file, so is also not necessary. The node configuration files, `package.json` and `package-lock.json`, are also not needed for Firebase deployment. The `gitignore` file is unnecessary, as are any IDE configuration files such as `.iml` files.