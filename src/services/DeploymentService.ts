import { Headers, get } from "request";
import { getRequest, postRequest, uploadFile } from "./Service";

export interface App {
    AppId: string;
    Name: string;
    ProjectId: string;
    Url: string;
}

export interface Job {
    JobId: string;
}

export interface Environment {
    Status: string;
    Url: string;
    mode: EnvironmentMode;
}

export interface EnvironmentStatus {
    Status: "Starting" | "Started";
}

export interface Upload {
    PackageId: string;
}

export interface Sandbox {
    AppId: string;
    Name: string;
    ProjectId: string;
    Url: string;
}

export interface Branch {
    Name: string;
    DisplayName: string;
    LatestTaggedVersion: string;
    LatestRevisionNumber: number;
    LatestRevisionMendixVersion: string;
}

export interface EnvironmentSettings {
    Constants: Constant[];
    CustomSettings: CustomSetting[];
    ScheduledEvents: ScheduledEvent[];
}

export interface Constant {
    Name: string;
    DataType: string;
    Value: string;
    DeployedValue: string;
}

export interface CustomSetting {
    Name: string;
    Value: string;
}

export interface ScheduledEvent {
    Name: string;
    Value: string;
    DeployedValue: string;
}

export type EnvironmentMode = "Sandbox" | "Test" | "Acceptance" | "Production";

/**
 * The Deploy API allows you to manage application environments in our public cloud. You can retrieve the status, start and stop applications, but also deploy and transport new model versions to application environments. To do the latter you will also need the Build API to create and manage deployment packages.
 * Based on https://docs.mendix.com/apidocs-mxsdk/apidocs/deploy-api
 */
export class DeploymentService {
    /**
     * Log the service calls to the console.
     */
    showLog = true;
    private headers: Headers;
    private baseUrl = "https://deploy.mendix.com/api/1";

    constructor(user: string, key: string) {
        // todo  strip last of base url.
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
     * Retrieves a specific branch that belongs to the team server project of a specific app which the authenticated user has access to as a regular user.
     * @param appName - Subdomain name of an app.
     * @param branchName - Name of the branch to get or ‘trunk’ to get the main line.
     */
    getBranch(appName: string, branchName: string): Promise<Branch> {
        // TODO: Could be move TeamServerServices
        this.log(`Get branch details ${appName} ${branchName}`);
        return getRequest<Branch>({
            url: `${this.baseUrl}/apps/${appName}/branches/${branchName}`,
            headers: this.headers
        });
    }

    /**
     * Retrieves all apps which the authenticated user has access to as a regular user. These apps can be found via the “Nodes overview” screen in the Mendix Platform.
     */
    getApps(): Promise<App[]> {
        this.log(`Get all apps`);
        return getRequest<App[]>({
            url: `${this.baseUrl}/apps/`,
            headers: this.headers
        });
    }

    /**
     * Retrieves a specific environment that is connected to a specific app which the authenticated user has access to as a regular user
     * @param appId - Sub-domain name of an app.
     * @param mode - The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironment(appId: string, mode: EnvironmentMode): Promise<Environment> {
        this.log(`Get environnement details for ${appId} ${mode}`);
        return getRequest<Environment>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}`,
            headers: this.headers
        });
    }

    /**
     * Retrieves all environments that are connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId - Sub-domain name of an app.
     */
    getEnvironments(appId: string): Promise<Environment[]> {
        this.log(`Get environments for ${appId}`);
        return getRequest<Environment[]>({
            url: `${this.baseUrl}/apps/${appId}/environments/`,
            headers: this.headers
        });
    }

    /**
     * Retrieves a specific app which the authenticated user has access to as a regular user. These app can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId - Sub-domain name of an app.
     */
    getApp(appId: string): Promise<App[]> {
        this.log(`Get app details fro  ${appId}`);
        return getRequest<App[]>({
            url: `${this.baseUrl}/apps/${appId}`,
            headers: this.headers
        });
    }

    /**
     * Creates a sandbox application for a requested project id.
     * @param projectId - The sprintr project identifier that should be linked to the new sandbox application.
     */
    createSandbox(projectId: string): Promise<Sandbox> {
        this.log(`Create sandbox for project ${projectId}`);
        return postRequest<Sandbox>({
            url: `${this.baseUrl}/apps/`,
            headers: this.headers,
            body: JSON.stringify({
                ProjectId: projectId
            })
        });
    }

    /**
     * Stops a specific environment that is connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId - Sub-domain name of an app.
     * @param mode - Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    stopApp(appId: string, mode: EnvironmentMode): Promise<string> {
        this.log(`Stop app: ${appId} ${mode}`);
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/stop`,
            headers: this.headers
        });
    }

    /**
     * Removes all data from a specific environment including files and database records. This action requires the environment to be in “NotRunning” status.
     * @param appId - Sub-domain name of an app.
     * @param mode - Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    cleanApp(appId: string, mode: EnvironmentMode): Promise<string> {
        this.log(`Clean environment: ${appId} ${mode}`);
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/clean`,
            headers: this.headers
        });
    }

    /**
     * Transports a specific deployment package to a specific environment. This action requires the environment to be in the “NotRunning” status.
     * @param appId - Sub-domain name of an app.
     * @param mode - Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param packageId - ID of the deployment package
     */
    transportPackage(appId: string, mode: EnvironmentMode, packageId: string): Promise<string> {
        // Check option for transport file?
        this.log(`Transport package: ${appId} ${mode} ${packageId}`);
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/transport`,
            headers: this.headers,
            body: JSON.stringify({
                PackageId: packageId
            })
        });
    }

    /**
     * Starts a specific environment that is connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId - Sub-domain name of an app.
     * @param mode - Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    startApp(appId: string, mode: EnvironmentMode): Promise<Job> {
        // Check option for transport file?
        this.log(`Start app: ${appId} ${mode}`);
        return postRequest<Job>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/start`,
            headers: this.headers,
            body: JSON.stringify({
                AutoSyncDb : true
            })
        });
    }

    /**
     * Retrieve the status of the start environment action.
     * @param appId - Sub-domain name of an app.
     * @param mode - Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param jobId - The identifier which can be used to track the progress of the start action
     */
    getEnvironmentStartStatus(appId: string, mode: EnvironmentMode, jobId: string): Promise<EnvironmentStatus> {
        return getRequest<EnvironmentStatus>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/start/${jobId}`,
            headers: this.headers
        });
    }

    /**
     * Wait for starting environment action returns the EnvironmentStatus
     * @param appId - Sub-domain name of an app.
     * @param mode - Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param jobId - The identifier which can be used to track the progress of the start action
     * @param timeOutSeconds - The time in seconds before waiting to start will stop polling, default 600s.
     */
    waitForStart(appId: string, mode: EnvironmentMode, jobId: string, timeOutSeconds = 600): Promise<EnvironmentStatus> {
        this.log(`Wait for startup: ${appId} ${mode} ${jobId} max ${timeOutSeconds} seconds`);
        return new Promise<EnvironmentStatus>((resolve, reject) => {
            const date = Date.now();
            const checkStatus = () => {
                const duration = (Date.now() - date) / 1000;

                if (duration > timeOutSeconds) {
                    reject(`Build timed out after ${timeOutSeconds}`);
                    return;
                }
                setTimeout(async () => {
                    try {
                        const startStatus = await this.getEnvironmentStartStatus(appId, mode, jobId);

                        if (startStatus.Status === "Started") {
                            resolve(startStatus);
                        } else if (startStatus.Status === "Starting") {
                            checkStatus();
                        } else {
                            reject("Starting failed for unknown reason");
                        }
                    } catch (startStatusError) {
                        reject(startStatusError);
                    }
                }, 10 * 1000);
            };
            checkStatus();
        });
    }

    /**
     * Wait for sandbox environment startup after build. Build automatically startup deployment to the sandbox
     * @param appId - Sub-domain name of an app.
     * @param timeOutSeconds - The time in seconds before waiting to start will stop polling, default 600s.
     */
    waitForSandboxStart(appId: string, timeOutSeconds = 600): Promise<void> {
        this.log(`Wait for sandbox to start ${appId} max ${timeOutSeconds} seconds`);
        return new Promise<void>(async (resolve, reject) => {
            const environmentInfo = await this.getEnvironment(appId, "Sandbox");
            const url = environmentInfo.Url + "/xas/";
            const date = Date.now();
            const checkStatus = () => {
                const duration = (Date.now() - date) / 1000;

                if (duration > timeOutSeconds) {
                    reject(`Sandbox starting timed out after ${timeOutSeconds}`);
                    return;
                }
                setTimeout(async () => {
                    try {
                        const statusCode = await this.getHttpStatusCode(url);
                        if (statusCode === 401) {
                             resolve();
                        } else if (statusCode === 503) {
                            this.log(". ", true);
                            checkStatus();
                        } else {
                            reject("Error wait for start sandbox " + url + " code: " + statusCode);
                        }
                    } catch (startStatusError) {
                        reject(startStatusError);
                    }
                }, 1000);
            };
            this.log("Waiting 60 seconds before build process will start the transport");
            setTimeout(checkStatus, 60 * 1000);
        });
    }

    /**
     * Get the response code for a request to an URL
     * @param url - Full URL to test
     */
    getHttpStatusCode(url: string): Promise<number> {
        return new Promise<number>((resolve) => {
            get(url, (error: any, response: any) => {
                resolve(response.statusCode);
            });
        });
    }

    /**
     * Uploads a deployment package from the local system to a specific app. This package can then be transported to a specific environment for deployment.
     * @param appId - Subdomain name of an app.
     * @param filename - Path and filename.
     */
    uploadPackage(appId: string, filename: string): Promise<Upload> {
        this.log(`Upload new package to ${appId} file: ${filename}`);
        return uploadFile<Upload>({
            url: `${this.baseUrl}/apps/${appId}/packages/upload`,
            headers: this.headers
        }, filename);
    }

    /**
     * Gets current values of custom settings, constants and scheduled events used by the target environment.
     * @param appId - Sub-domain name of an app.
     * @param mode - The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironmentSettings(appId: string, mode: EnvironmentMode): Promise<EnvironmentSettings> {
        this.log(`Get environment settings ${appId} - ${mode}`);
        return getRequest<EnvironmentSettings>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/settings/`,
            headers: this.headers
        });
    }

    /**
     * Changes value of existing environment settings like custom settings, constants and scheduled events. These changes are applied after restarting the environment.
     * @param appId - Sub-domain name of an app.
     * @param mode - The mode of the environment of the app. An environment with this mode should exist.
     */
    setEnvironmentSettings(appId: string, mode: EnvironmentMode): Promise<string> {
        this.log(`Set environment settings ${appId} - ${mode}`);
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/settings/`,
            headers: this.headers,
            body: JSON.stringify({
                AutoSyncDb : true
            })
        });
    }

    /*
     TODO: Not implemented services calls:
        List Environment Backups
        Download a Backup for an Environment
     */

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
