# Mendix widget build script
For the purpose of continuous integration and testing.
These script can checkout a Mendix project, update the latest widget, build, upload and start the project on a cloud node.
After these scripts, integration tests could be run on the node.

## Usage
1) install this module
 > npm install --save mendix-widget-build-script

2) Copy the `sample.travis.yml` to your project root `.travis.yml`
Update the env: global variable:
```
  - MX_APP_NAME=your-app-name
  - MX_PROJECT_ID=your-project-id
  - MX_USER=your-mendix-user-email@your-domain.com
```
Generate the encrypted values for your MX_API_KEY and MX_PASSWORD via [Travis CLI](https://github.com/travis-ci/travis.rb). They'll be appended as secrets to your .travis.yml, with the rest of your global variables.

> travis encrypt MX_API_KEY=your-mendix-account-api-key --add env.global

The API key could be generated in your Mendix account using the following instructions
https://docs.mendix.com/apidocs-mxsdk/apidocs/authentication

> travis encrypt MX_PASSWORD=your-mendix-password --add env.global

Note: for security reasons, it is advisable to create a CI user that can only access the testing repositories.

*GitHub Release setup*

The CLI can help you to setup the release via GitHub. After the build is completed the `Widget.mpk` and `TestProject.mpk` will be added to your release.
> travis setup releases

Set the additional properties in the section `deploy`
```
  file_glob: true
  file: dist/release/*
  skip_cleanup: true
  on:
    tags: true
```
See: https://docs.travis-ci.com/user/deployment/releases/

When needed, it is possible to overwrite the default values by adding the variable in the section `env: global`:
```
  - MX_TEAM_SERVER_URL=https://teamserver.sprintr.com
  - MX_BRANCH_NAME=trunk
  - MX_API_URL=https://deploy.mendix.com/api/1
  - MX_ENVIRONMENT=Sandbox
```

3) To run your build script locally, copy the `dist/localSettings.js` to the project root.
```
exports.settings = {
    appName: "your-app-name",
    key: "your-mendix-account-api-key",
    password: "your-mendix-password",
    projectId: "your-project-id",
    user: "your-mendix-user-email@your-domain.com"
};
```
!! **Important** !! Add this file to your git ignore, as the password and key are not encrypted they should never be committed into a public repository

.gitignore
> localConfig.js

 When needed, you can overwrite the default values by adding them in the `exports.setting` object:
 ```
    branchName: "trunk",
    environment: "Sandbox",
    testProjectName: "TestProject.mpk",
    apiUrl: "https://deploy.mendix.com/api/1",
    teamServerUrl: "https://teamserver.sprintr.com"
 ```

4) Add to the npm `package.json` the "widgetName" and the required scripts for deployment.
```
"widgetName": "MyAwesomeWidget",
"scripts": {
    "pretest": "<build script, output the widget into 'dist/<version>'>",
    "test": "npm run updateProject && npm run deployApp && <integrations test>",
    "updateProject": "node ./node_modules/mendix-widget-build-script/dist/UpdateMxProject.js",
    "deployApp": "node ./node_modules/mendix-widget-build-script/dist/DeployMxApp.js"
  },
```

5) Enable your repository at https://travis-ci.org

6) Add the awesome badges to the `README.md` to show build status.
```
[![Build Status](https://travis-ci.org/<user/org>/<repo>.svg?branch=master)](https://travis-ci.org/<user/org>/<repo>)
```

7) Commit the changes into your repository (Except the local config)

8) Checkout how your build is doing `https://travis-ci.org/<user/org>/<repo>/`

## Development

For further development of the widget build scripts:

1) Fork the code or checkout the code:

> git clone https://github.com/FlockOfBirds/mendix-widget-build-script.git

2) Create a copy of `./dist/localSettings.js` into the project root and configure like step 3 of the usage instructions. To run a local test:

> npm test

3) To create a release build:

> npm run build
