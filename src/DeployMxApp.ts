import { DeploymentService, EnvironmentMode } from "./services/DeploymentService";
import { BuildService } from "./services/BuildService";
import { getSettings } from "./Settings";
import * as archiver from "archiver";

const settings = getSettings();
console.log("Build and deploy Mendix project with settings: " + JSON.stringify(settings));

const appName = settings.appName;
const environment: EnvironmentMode = settings.environment;
const branchName = settings.branchName;

const deploy = new DeploymentService(settings.user, settings.key);
const build = new BuildService(settings.user, settings.key);
if (settings.apiUrl) {
    deploy.setBaseUrl(settings.apiUrl);
    build.setBaseUrl(settings.apiUrl);
}

deployApp().then(success => process.exit(0), error => process.exit(1));

async function deployApp() {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            console.log("Get branch details");
            const branch = await deploy.getBranch(appName, branchName);
            const latestBuiltRevision = branch.LatestTaggedVersion.substring(branch.LatestTaggedVersion.lastIndexOf(".") + 1);
            if (latestBuiltRevision === branch.LatestRevisionNumber.toString()) {
                console.log("It is not needed to build, as the latest revision is already built.");
                resolve(true);
                return;
            }
            const nextRev = branch.LatestRevisionNumber.toString();
            console.log("Start build:", appName, branchName, nextRev, settings.widget.version);
            const buildAction = await build.startBuild(appName, branchName, nextRev, settings.widget.version);
            console.log("Wait for build:", appName, buildAction.PackageId);
            const deployPackage = await build.waitForBuild(appName, buildAction.PackageId, 600);
            if (deployPackage.Status !== "Succeeded") {
                console.log("No build succeeded within 10 minutes.");
                reject("No build succeeded within 10 minutes.");
                return;
            }
            if (environment === "Sandbox") {
                // Build in the Sandbox does automatically transport and and restarts after 60 seconds
                await deploy.waitForSandboxStart(appName, 600);
            } else {
                console.log("Stop app:", appName, environment);
                await deploy.stopApp(appName, environment);
                console.log("Clean environment:", appName, environment);
                await deploy.cleanApp(appName, environment);
                console.log("Transport package:", appName, environment, buildAction.PackageId);
                await deploy.transportPackage(appName, environment, buildAction.PackageId);
                console.log("Start app:", appName, environment);
                const startJob = await deploy.startApp(appName, environment);
                console.log("Wait for startup:", appName, environment, startJob.JobId);
                await deploy.waitForStart(appName, environment, startJob.JobId, 600);
            }

            console.log("App successfully started.");
            resolve(true);
        } catch (error) {
            console.error("Error deploying", error);
            reject(error);
        }
    });
}
