"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:rule no-console no-angle-bracket-type-assertion no-var-requires
const fs = require("fs");
const path = require("path");
const projectPath = path.resolve(__dirname, "../../../");
const pkg = require(path.resolve(projectPath, "package.json"));
exports.defaultSettings = {
    apiUrl: "https://deploy.mendix.com/api/1",
    branchName: "trunk",
    environment: "Sandbox",
    teamServerUrl: "https://teamserver.sprintr.com",
    testProjectName: "TestProject.mpk"
};
exports.getSettings = () => {
    const localSettingFile = path.resolve(projectPath, "localSettings.js");
    let settings = exports.defaultSettings;
    if (fs.existsSync(localSettingFile)) {
        console.log("Running with local settings from " + localSettingFile);
        const localFileSettings = require(localSettingFile).settings;
        console.log("localFileSettings", localFileSettings);
        settings = Object.assign({}, settings, localFileSettings);
        checkSettings(settings);
    }
    else if (process.env.CI) {
        console.log("Running with CI settings");
        checkEnvVars();
        settings = {
            apiUrl: process.env.MX_API_URL || exports.defaultSettings.apiUrl,
            appName: process.env.MX_APP_NAME,
            branchName: process.env.MX_BRANCH_NAME || exports.defaultSettings.branchName,
            environment: process.env.MX_ENVIRONMENT || exports.defaultSettings.environment,
            key: process.env.MX_API_KEY,
            password: process.env.MX_PASSWORD,
            projectId: process.env.MX_PROJECT_ID,
            teamServerUrl: process.env.MX_TEAM_SERVER_URL || exports.defaultSettings.teamServerUrl,
            testProjectName: process.env.MX_TEST_PROJECT_NAME || exports.defaultSettings.testProjectName,
            user: process.env.MX_USER
        };
    }
    else {
        throw Error("No config found, for local config add 'localConfig.js'");
    }
    const distFolder = path.resolve(projectPath, "dist");
    settings.folder = {
        build: path.resolve(distFolder, "mxbuild"),
        dist: distFolder,
        release: path.resolve(distFolder, "release")
    };
    settings.widget = {
        name: pkg.widgetName,
        version: pkg.version
    };
    settings.projectUrl = settings.teamServerUrl + "/" + settings.projectId;
    return settings;
};
function checkEnvVars() {
    const vars = ["MX_APP_NAME", "MX_API_KEY", "MX_PASSWORD", "MX_PROJECT_ID", "MX_USER"];
    const missingVars = vars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw Error("Missing environment variable: " + missingVars.join(", "));
    }
}
function checkSettings(settings) {
    const minimalSettings = ["appName", "key", "password", "projectId", "user"];
    const missingSettings = minimalSettings.filter(varName => !settings[varName]);
    if (missingSettings.length > 0) {
        throw Error("Missing setting: " + missingSettings.join(", "));
    }
}
