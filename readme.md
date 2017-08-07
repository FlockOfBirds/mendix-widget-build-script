# Mendix widget build script
For the purpose oft continues integration and testing.
These script can checkout a Mendix project, update the latest widget, build, upload and start the project to cloud node.
After these script integrations test could be run on the node.

## Usage
1) install this module
 > npm install --save mendix-widget-build-script

2) Copy the `sample.travis.yml` to your project root `.travis.yml`
Update the env: global variable:
```
  - MX_APP_NAME=texteditorwidget
  - MX_BRANCH_NAME=trunk
  - secure: [secret]
  - MX_PROJECT_ID=8648ccda-9281-4768-abb2-8ce61a80e2f1
  - MX_USER=ci@example.org
  - secure: [secret]
```
Create your own secrets for your MX_API_KEY and MX_PASSWORD via travis CLI

> travis encrypt MX_API_KEY=yourSecretKey --add env.global

The API key could be generated in your Mendix account using the following instructions
https://docs.mendix.com/apidocs-mxsdk/apidocs/authentication

> travis encrypt MX_PASSWORD=yourSecretPassword --add env.global

Note: for security reason it is advisable to create an CI user that can only access the testing repositories.

Travis CLI: https://github.com/travis-ci/travis.rb

Update the `deploy: on: repo:` `<user/org>/<repo>`

The CLI can help you setup the an github token
> travis setup releases

See: https://docs.travis-ci.com/user/deployment/releases/

3) Copy the `dist/localSettings.js` to your project root, to run the test locally
```
exports.settings = {
    appName: "appName",
    key: "xxxxxxxx-xxxx-xxxx-xxxxx-xxxxxxxxxxxx",
    password: "secret",
    projectId: "xxxxxxxx-xxxx-xxxx-xxxxx-xxxxxxxxxxxx",
    user: "ci@example.com"
};
```
!! **Important** !! Add this file to your git ignore, as the password and key are not encrypted they should never commit into a public repository

.gitignore
> localConfig.js

4) Add to the npm `package.json` the "widgetName" and the script the required scripts for deployment
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

6) Add the awesome badges to the `readme.md` to show build status
```
[![Build Status](https://travis-ci.org/<user/org>/<repo>.svg?branch=master)](https://travis-ci.org/<user/org>/<repo>)
```

7) Commit the changes int your repo (Except the local config)

8) Checkout how your build is doing `https://travis-ci.org/<user/org>/<repo>/`

## develop

Testings can be done with copy and configure `localSettings.js` in the project root and run:

> npm run updateProject
> npm run deployApp

Release build:

> npm run build

Test:

> npm test

