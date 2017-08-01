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
const DeploymentService_1 = require("./services/DeploymentService");
const BuildService_1 = require("./services/BuildService");
const Settings_1 = require("./Settings");
const settings = Settings_1.getSettings();
console.log("Build and deploy Mendix project with settings: " + JSON.stringify(settings));
const appName = settings.appName;
const environment = settings.environment;
const branchName = settings.branchName;
const deploy = new DeploymentService_1.DeploymentService(settings.user, settings.key);
const build = new BuildService_1.BuildService(settings.user, settings.key);
if (settings.apiUrl) {
    deploy.setBaseUrl(settings.apiUrl);
    build.setBaseUrl(settings.apiUrl);
}
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
                if (environment === "Sandbox") {
                    // Build in the Sandbox does automatically transport and and restarts after 60 seconds
                    yield deploy.waitForSandboxStart(appName, 600);
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
                    yield deploy.waitForStart(appName, environment, startJob.JobId, 600);
                }
                console.log("App successfully started.");
                resolve(true);
            }
            catch (error) {
                console.error("Error deploying", error);
                reject(error);
            }
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVwbG95TXhBcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvRGVwbG95TXhBcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG9FQUFrRjtBQUNsRiwwREFBdUQ7QUFDdkQseUNBQXlDO0FBR3pDLE1BQU0sUUFBUSxHQUFHLHNCQUFXLEVBQUUsQ0FBQztBQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUUxRixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ2pDLE1BQU0sV0FBVyxHQUFvQixRQUFRLENBQUMsV0FBVyxDQUFDO0FBQzFELE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFFdkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsRSxNQUFNLEtBQUssR0FBRyxJQUFJLDJCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXZFOztRQUNJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBVSxDQUFPLE9BQU8s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