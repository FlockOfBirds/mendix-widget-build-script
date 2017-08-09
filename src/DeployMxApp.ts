import { DeploymentService } from "./services/DeploymentService";
import { BuildService } from "./services/BuildService";
import { getSettings } from "./Settings";

const settings = getSettings();
console.log("Build and deploy Mendix project with settings: " + JSON.stringify(settings));

const { appName, environment, branchName } = settings;

const deploy = new DeploymentService(settings.user, settings.key);
const build = new BuildService(settings.user, settings.key);
if (settings.apiUrl) {
    deploy.setBaseUrl(settings.apiUrl);
    build.setBaseUrl(settings.apiUrl);
}

deployApp().then(() => process.exit(0), () => process.exit(1));

async function deployApp() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const branch = await deploy.getBranch(appName, branchName);
            const latestBuiltRevision = branch.LatestTaggedVersion.substring(branch.LatestTaggedVersion.lastIndexOf(".") + 1);
            if (latestBuiltRevision === branch.LatestRevisionNumber.toString()) {
                console.log("It is not needed to build, as the latest revision is already built.");
                resolve();

                return;
            }
            const version = getSematicVersion(settings.widget.version);
            const nextRevisionNumber = branch.LatestRevisionNumber.toString();
            const buildAction = await build.startBuild(appName, branchName, nextRevisionNumber, version);
            await build.waitForBuild(appName, buildAction.PackageId);
            if (environment === "Sandbox") {
                // The 'startBuild' action on a Sandbox environment, automatically transports and restarts, just wait.
                await deploy.waitForSandboxStart(appName);
            } else {
                await deploy.stopApp(appName, environment);
                await deploy.cleanApp(appName, environment);
                await deploy.transportPackage(appName, environment, buildAction.PackageId);
                const startJob = await deploy.startApp(appName, environment);
                await deploy.waitForStart(appName, environment, startJob.JobId);
            }

            console.log("App successfully started.");
            resolve();
        } catch (error) {
            console.error("Error deploying", error);
            reject(error);
        }
    });
}

function getSematicVersion(version: string): string {
    const regex = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)?\b/ig;
    const matches = regex.exec(version);
    return matches ? matches[0] : "0.0.1";
}
