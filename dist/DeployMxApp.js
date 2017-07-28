"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:rule no-console max-line-length
const DeploymentService_1 = require("./DeploymentService");
const BuildService_1 = require("./BuildService");
const Settings_1 = require("./Settings");
const settings = Settings_1.getSettings();
console.log("Build and deploy Mendix project with settings: " + JSON.stringify(settings));
const appName = settings.appName;
const environment = settings.environment;
const branchName = settings.branchName;
const deploy = new DeploymentService_1.DeploymentService(settings.apiUrl, settings.user, settings.key);
const build = new BuildService_1.BuildService(settings.apiUrl, settings.user, settings.key);
deployApp().then(success => process.exit(0), error => process.exit(1));
function deployApp() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Get branch details");
                const branch = yield deploy.getBranch(appName, branchName);
                const latestBuiltRevision = branch.LatestTaggedVersion.substring(branch.LatestTaggedVersion.lastIndexOf(".") + 1);
                if (latestBuiltRevision === branch.LatestRevisionNumber.toString()) {
                    console.log("It is not needed to build, as the latest revision is already built.");
                    resolve(true);
                    return;
                }
                const nextRev = branch.LatestRevisionNumber.toString();
                console.log("Start build:", appName, branchName, nextRev, settings.widget.version);
                const buildAction = yield build.startBuild(appName, branchName, nextRev, settings.widget.version);
                console.log("Wait for build:", appName, buildAction.PackageId);
                const deployPackage = yield build.waitForBuild(appName, buildAction.PackageId, 600);
                if (deployPackage.Status !== "Succeeded") {
                    console.log("No build succeeded within 10 minutes.");
                    reject("No build succeeded within 10 minutes.");
                    return;
                }
                let started = false;
                if (environment === "Sandbox") {
                    // Build in the Sandbox does automatically transport and and restarts after 60 seconds
                    started = yield deploy.waitForSandboxStart(appName, 600);
                }
                else {
                    console.log("Stop app:", appName, environment);
                    yield deploy.stopApp(appName, environment);
                    console.log("Clean environment:", appName, environment);
                    yield deploy.cleanApp(appName, environment);
                    console.log("Transport package:", appName, environment, buildAction.PackageId);
                    yield deploy.transportPackage(appName, environment, buildAction.PackageId);
                    console.log("Start app:", appName, environment);
                    const startJob = yield deploy.startApp(appName, environment);
                    console.log("Wait for startup:", appName, environment, startJob.JobId);
                    started = yield deploy.waitForStart(appName, environment, startJob.JobId, 600);
                }
                if (started === true) {
                    console.log("App successfully started.");
                    resolve(true);
                }
                else {
                    console.error("Failed to startup");
                    reject("Failed to startup");
                }
                console.log("Done");
            }
            catch (error) {
                console.error("Error deploying", error);
                reject(error);
            }
        }));
    });
}
