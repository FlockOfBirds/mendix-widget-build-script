import * as fs from "fs";
import * as path from "path";
import { EnvironmentMode } from "./services/DeploymentService";

const devMode = process.env.RUN_MODE && (<string>process.env.RUN_MODE).trim() === "dev";
if (devMode) {
    console.log("Running in dev mode");
}

const projectPath = path.resolve(__dirname, devMode ? "../" : "../../../");
const pkg: any = require(path.resolve(projectPath, "package.json"));

export interface MinimalSettings {
    appName: string;
    key: string;
    user: string;
    password: string;
    projectId: string;
}

export interface Settings extends MinimalSettings {
    apiUrl: string;
    branchName: string;
    environment: EnvironmentMode;
    teamServerUrl: string;
    testProjectName: string;
    widget: {
        names: string[];
        version: string;
    };
    folder: {
        build: string;
        dist: string;
        release: string;
    };
}

export const defaultSettings: Partial<Settings> = {
    branchName: "trunk",
    environment: "Sandbox",
    testProjectName: "TestProject.mpk"
};

export const getSettings = (): Settings => {
    const localSettingFile = path.resolve(projectPath, "localSettings.js");
    let settings = defaultSettings;
    if (fs.existsSync(localSettingFile)) {
        console.log("Running with local settings from " + localSettingFile);
        const localFileSettings = require(localSettingFile).settings;
        settings = { ...settings, ...localFileSettings };
        checkSettings(settings);
    } else if (process.env.CI) {
        console.log("Running with CI settings");
        checkEnvVars();
        settings = {
            appName: process.env.MX_APP_NAME,
            branchName: process.env.MX_BRANCH_NAME || defaultSettings.branchName,
            environment: <EnvironmentMode>process.env.MX_ENVIRONMENT || defaultSettings.environment,
            key: process.env.MX_API_KEY,
            password: process.env.MX_PASSWORD,
            projectId: process.env.MX_PROJECT_ID,
            testProjectName: process.env.MX_TEST_PROJECT_NAME || defaultSettings.testProjectName,
            user: process.env.MX_USER
        };
        if (process.env.MX_API_URL) {
            settings.apiUrl = process.env.MX_API_URL;
        }
        if (process.env.MX_TEAM_SERVER_URL) {
            settings.teamServerUrl = process.env.MX_TEAM_SERVER_URL;
        }
    } else {
        throw Error("No config found, for local config add 'localSettings.js'");
    }
    const distFolder = path.resolve(projectPath, "dist");
    settings.folder = {
        build: path.resolve(distFolder, "mxbuild"),
        dist: distFolder,
        release: path.resolve(distFolder, "release")
    };
    settings.widget = {
        names: (Array.isArray(pkg.widgetName) ? pkg.widgetName : [ pkg.widgetName ]) as string[],
        version: pkg.version
    };
    return settings as Settings;
};

function checkEnvVars() {
    const vars = [ "MX_APP_NAME", "MX_API_KEY", "MX_PASSWORD", "MX_PROJECT_ID", "MX_USER" ];
    const missingVars = vars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw Error("Missing environment variable: " + missingVars.join(", "));
    }
}

function checkSettings(settings: Partial<Settings>) {
    type SettingsKeys = keyof Settings;
    const minimalSettings: SettingsKeys[] = [ "appName", "key", "password", "projectId", "user" ];
    const missingSettings = minimalSettings.filter(varName => !settings[varName]);
    if (missingSettings.length > 0) {
        throw Error("Missing setting: " + missingSettings.join(", "));
    }
}
