# Mendix widget build script
For the purpose of continuous integration and testing.
These script can checkout a Mendix project, update the latest widget, build, upload and start the project on a cloud node.
After these scripts, integration tests could be run on the node.

## Usage
1) install this module
 > npm install --save mendix-widget-build-script

2) Copy the `sample.travis.yml` to your project root `.travis.yml`
Note that `your-app-name` is the part in the sandbox URL: https://your-app-name.mxapps.io/ that might differ from the name of the project.
Update the env: global variable:
``` yml
  - MX_APP_NAME=your-app-name
  - MX_PROJECT_ID=your-project-id
  - MX_USER=your-mendix-user-email@your-domain.com
```

When needed, it is possible to overwrite the default values by adding the variable in the section `env: global`:
```
  - MX_TEAM_SERVER_URL=https://teamserver.sprintr.com
  - MX_BRANCH_NAME=trunk
  - MX_API_URL=https://deploy.mendix.com/api/1
  - MX_ENVIRONMENT=Sandbox
```

3) To run your build script locally, copy the `dist/localSettings.js` to the project root.
``` js
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
> localSettings.js

 When needed, you can overwrite the default values by adding them in the `exports.setting` object:
 ```
    branchName: "trunk",
    environment: "Sandbox",
    testProjectName: "TestProject.mpk",
    apiUrl: "https://deploy.mendix.com/api/1",
    teamServerUrl: "https://teamserver.sprintr.com"
 ```

4) Add to the npm `package.json` the "widgetName" (string | string[]) and the required scripts for deployment.
``` json
"widgetName": "MyAwesomeWidget",
"scripts": {
    "pretest": "<build script, output the widget into 'dist/<version>'>",
    "test": "npm run <some other tests> && npm run test:conditional",
    "test:conditional": "node ./node_modules/mendix-widget-build-script/dist/CheckPullRequestFromFork.js && echo 'Skip tests on forked pull request' || npm run deployAndTest",
    "deployAndTest": "npm run deploy && npm run <your integration test>",
    "deploy": " npm run updateProject && npm run deployApp",
    "updateProject": "node ./node_modules/mendix-widget-build-script/dist/UpdateMxProject.js",
    "deployApp": "node ./node_modules/mendix-widget-build-script/dist/DeployMxApp.js"
  },
```

5) Enable your repository at https://travis-ci.org

Set your secret environment variables https://docs.travis-ci.com/user/environment-variables/#Defining-Variables-in-Repository-Settings
```
MX_PASSWORD
MX_API_KEY
GITHUB_KEY
```
Note: for security reasons, it is advisable to create a CI user that can only access the testing repositories.

- The Mendix API key could be generated in your Mendix account, using the following instructions
https://docs.mendix.com/apidocs-mxsdk/apidocs/authentication
- The GitHub API key could be generated for your GitHub account from https://github.com/settings/tokens
  - Click "Generate new token" 
  - Set a "Token description" like "Automatic releases via Travis CI"
  - Set scope `public_repo`
  - Click "Generate token"

Make sure you keep the 'Display value in build log' stays 'off' else your passwords will be in the build log for everybody to read.

Note: that the environment variables in the travis-ci.org can be used to overwrite other settings from `.travis.xml` when need be.

6) Add the awesome badges to the `README.md` to show build status.
``` md
[![Build Status](https://travis-ci.org/<user/org>/<repo>.svg?branch=master)](https://travis-ci.org/<user/org>/<repo>)
```

7) Commit the changes into your repository (Except the local config)

8) Checkout how your build is doing `https://travis-ci.org/<user/org>/<repo>/`

9) When a `tag` is create in the git repository, the Travis CI script will start build, test and automatically add the .mpk to the GitHub release on success.

## Development

For further development of the widget build scripts:

1) Fork the code or checkout the code:

> git clone https://github.com/FlockOfBirds/mendix-widget-build-script.git

2) Create a copy of `./dist/localSettings.js` into the project root and configure like step 3 of the usage instructions. To run a local test:

> npm test

3) To create a release build:

> npm run build
