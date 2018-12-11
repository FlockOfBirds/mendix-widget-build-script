import { Headers } from "request";
import { deleteRequest, getFile, getRequest, postRequest } from "./Service";

export interface Build {
    PackageId: string;
}

export interface Package {
    PackageId: string;
    Name: string;
    Description: string;
    Version: string;
    Creator: string;
    CreationDate: number;
    Status: "Succeeded" | "Queued" | "Building" | "Uploading" | "Failed";
    Size: number;
}

/**
 * The Build API allows you to manage deployment packages and create new deployment packages using our build server. You will need the information from the Teamserver API as input for these API calls.
 * Based on https://docs.mendix.com/apidocs-mxsdk/apidocs/build-api
 */
export class BuildService {
    /**
     * Log the service calls to the console.
     */
    showLog = true;
    private headers: Headers;
    private baseUrl = "https://deploy.mendix.com/api/1";

    constructor(user: string, key: string) {
        this.headers = {
            "Mendix-Username": user,
            "Mendix-ApiKey": key,
            "ContentType": "application/json"
        };
    }
    /**
     * Overwrite the default API RUL
     * @param url - The URL to the Mendix API
     */
    setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    /**
     * Start the process to build a deployment package, based on the team server project of a specific app that the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the Nodes screen in the Mendix Platform. For a Sandbox, this will also trigger a deployment of the new package.
     * @param appId - Subdomain name of an app.
     * @param branchName - Name of the branch. This is ‘trunk’ for the main line or a specific branch name.
     * @param revision - Number of the revision to build a package from.
     * @param version - Package version. This will also be the name of the tag on the project team server.
     */
    startBuild(appId: string, branchName: string, revision: string, version: string): Promise<Build> {
        this.log(`Start build: ${appId}, ${branchName}, ${revision}, ${version}`);
        const currentDate = new Date();
        const timeStamp = currentDate.getFullYear() + "-"
                        + (currentDate.getMonth() + 1) + "-"
                        + currentDate.getDate() + " "
                        + currentDate.getHours() + ":"
                        + currentDate.getMinutes() + ":"
                        + currentDate.getSeconds();

        return postRequest<Build>({
            url: `${this.baseUrl}/apps/${appId}/packages/`,
            headers: this.headers,
            body: JSON.stringify({
                Branch: branchName,
                Revision: revision,
                Version: version,
                Description: `CI Build ${timeStamp}`
            })
        });
    }

    /**
     * Wait for building process to finish
     * @param appId - Subdomain name of an app.
     * @param packageId - Unique identification of the package that build
     * @param timeOutSeconds - Maximum waiting time for build to complete, default 600s.
     */
    waitForBuild(appId: string, packageId: string, timeOutSeconds = 600): Promise<Package> {
        this.log(`Wait for build: ${appId}, ${packageId}, max ${timeOutSeconds} seconds`);
        return new Promise<Package>((resolve, reject) => {
            const date = Date.now();
            const checkStatus = () => {
                const duration = (Date.now() - date) / 1000;

                if (duration > timeOutSeconds) {
                    reject(`Build timed out after ${timeOutSeconds}`);

                    return;
                }
                setTimeout(async () => {
                    try {
                        const deployPackage = await this.getPackage(appId, packageId);
                        if (deployPackage.Status === "Succeeded") {
                            this.log("Build completed");
                            resolve(deployPackage);
                        } else if (deployPackage.Status === "Failed") {
                            reject("Build Failed. Check the 'Latest build output' on https://cloud.home.mendix.com DEPLOY > Environments");
                        } else {
                            this.log(". ", true);
                            checkStatus();
                        }
                    } catch (getPackageError) {
                        reject(getPackageError);
                    }
                }, 10 * 1000);
            };
            this.log(". ", true);
            checkStatus();
        });
    }

    /**
     * Retrieves a specific deployment package that is available for a specific app which the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the “Nodes overview” screen in the Mendix Platform.
     * @param appId - Subdomain name of an app.
     * @param packageId - Id of the deployment package.
     */
    getPackage(appId: string, packageId: string): Promise<Package> {
        // this.log(`Get packages for app ${appId}, ${packageId}`);
        return getRequest<Package>({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}/`,
            headers: this.headers
        });
    }

    /**
     * Retrieves all deployment packages that are available for a specific app which the authenticated user has access to as a regular user. These packages can be found if you click Details on an app in the “Nodes overview” screen in the Mendix Platform.
     * @param appId - Subdomain name of an app.
     */
    getPackages(appId: string): Promise<Package[]> {
        this.log(`Get package list for app ${appId}`);
        return getRequest<Package[]>({
            url: `${this.baseUrl}/apps/${appId}/packages/`,
            headers: this.headers
        });
    }

    /**
     * Downloads a specific deployment package that is available for a specific app that the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the Nodes screen in the Mendix Platform.
     * @param appId - Subdomain name of an app.
     * @param packageId - Id of the deployment package.
     * @param filename - full path and filename where the downloaded file needs to be stored
     */
    downloadPackage(appId: string, packageId: string, filename: string): Promise<string> {
        this.log(`Download package ${appId}, ${packageId} to ${filename}`);
        return getFile({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}/download`,
            headers: this.headers
        }, filename);
    }

    /**
     * Deletes a specific deployment package that is available for a specific app that the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the Nodes screen in the Mendix Platform.
     * @param appId - Subdomain name of an app.
     * @param packageId - Id of the deployment package.
     */
    deletePackage(appId: string, packageId: string): Promise<string> {
        this.log(`Delete package ${appId}, ${packageId}`);
        return deleteRequest({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}`,
            headers: this.headers
        });
    }

    private log(message: string, inline = false) {
        if (this.showLog) {
            if (inline && process && process.stdout) {
                process.stdout.write(". ");
            } else {
                console.log(message);
            }
        }
     }
}
