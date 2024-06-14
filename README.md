This is the companion web application for the "Sounds of San Anto" project.

To get this working on your local machine for development purposes, you must have the appropriate mapbox and firebase credentials in a file called `keys.js`. The structure of the `keys.js` file is as follows:

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

Without the appropriate firebase and mapbox credentials, the map will not load and the data will not be retrieved.

To deploy a project to a Firebase project account, run `firebase init` and then `firebase deploy --only hosting`.

The Firebase deployment configuration file is `firebase.json`. This determines all the files that do not need to be uploaded for deployment. Note that the JSON files and python scripts should not be deployed as they are not necessary. The node configuration files, `package.json` and `package-lock.json`, are also not needed for Firebase deployment. The `gitignore` file is unnecessary, as are any IDE configuration files such as `.iml` files.