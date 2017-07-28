// tslint:disable:rule no-console no-angle-bracket-type-assertion no-var-requires
import * as fs from "fs";
import * as path from "path";
import { EnvironmentMode } from "./DeploymentService";

const projectPath = path.resolve(__dirname, "../../../");
const pkg: any = require(path.resolve(projectPath, "package.json"));

export interface MinimalSettings {
    appName: string;
    key: string;
    user: string;
    password: string;
    projectId: string;
}
interface Settings extends MinimalSettings {
    apiUrl: string;
    branchName: string;
    environment: EnvironmentMode;
    projectUrl: string;
    teamServerUrl: string;
    testProjectName: string;
    widget: {
        name: string;
        version: string;
    };
    folder: {
        build: string;
        dist: string;
        release: string;
    };
}

export const defaultSettings: PartialSettings = {
    apiUrl: "https://deploy.mendix.com/api/1",
    branchName: "trunk",
    environment: "Sandbox",
    teamServerUrl: "https://teamserver.sprintr.com",
    testProjectName: "TestProject.mpk"
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type PartialSettings = Partial<Settings>;

export const getSettings = (): Settings => {
    const localSettingFile = path.resolve(projectPath, "localSettings.js");
    let settings: PartialSettings = defaultSettings;
    if (fs.existsSync(localSettingFile)) {
        console.log("Running with local settings from " + localSettingFile);
        const localFileSettings = require("./localSettings").settings;
        console.log("localFileSettings", localFileSettings);
        settings = { ...settings, ...localFileSettings };
        checkSettings(settings);
    } else if (process.env.CI) {
        console.log("Running with CI settings");
        checkEnvVars();
        settings = {
            apiUrl: process.env.MX_API_URL || defaultSettings.apiUrl,
            appName: process.env.MX_APP_NAME,
            branchName: process.env.MX_BRANCH_NAME || defaultSettings.branchName,
            environment: <EnvironmentMode>process.env.MX_ENVIRONMENT || defaultSettings.environment,
            key: process.env.MX_API_KEY,
            password: process.env.MX_PASSWORD,
            projectId: process.env.MX_PROJECT_ID,
            teamServerUrl: process.env.MX_TEAM_SERVER_URL || defaultSettings.teamServerUrl,
            testProjectName: process.env.MX_TEST_PROJECT_NAME || defaultSettings.testProjectName,
            user: process.env.MX_USER
        };
    } else {
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
    return <Settings>settings;
};

function checkEnvVars() {
    const vars = [ "MX_APP_NAME", "MX_API_KEY", "MX_PASSWORD", "MX_PROJECT_ID", "MX_USER" ];
    const missingVars = vars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw Error("Missing environment variable: " + missingVars.join(", "));
    }
}

function checkSettings(settings: PartialSettings) {
    const minimalSettings = [ "appName", "key", "password", "projectId", "user" ];
    const missingSettings = minimalSettings.filter(varName => !settings[varName]);
    if (missingSettings.length > 0) {
        throw Error("Missing setting: " + missingSettings.join(", "));
    }
}
