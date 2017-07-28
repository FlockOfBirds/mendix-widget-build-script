// tslint:disable:rule object-literal-sort-keys max-line-length no-console
import { Headers, RequestAPI, get, post } from "request";
import { getRequest, postRequest, uploadFile } from "./Service";

interface App {
    AppId: string;
    Name: string;
    ProjectId: string;
    Url: string;
}

interface Job {
    JobId: string;
}

interface Environment {
    Status: string;
    Url: string;
    mode: EnvironmentMode;
}

interface EnvironmentStatus {
    Status: "Starting" | "Started";
}

interface Upload {
    PackageId: string;
}

interface Sandbox {
    AppId: string;
    Name: string;
    ProjectId: string;
    Url: string;
}

interface Branch {
    Name: string;
    DisplayName: string;
    LatestTaggedVersion: string;
    LatestRevisionNumber: number;
    LatestRevisionMendixVersion: string;
}

interface EnvironmentSettings {
    Constants: Constant[];
    CustomSettings: CustomSetting[];
    ScheduledEvents: ScheduledEvent[];
}

interface Constant {
    Name: string;
    DataType: string;
    Value: string;
    DeployedValue: string;
}

interface CustomSetting {
    Name: string;
    Value: string;
}

interface ScheduledEvent {
    Name: string;
    Value: string;
    DeployedValue: string;
}

export type EnvironmentMode = "Sandbox" | "Test" | "Acceptance" | "Production";

export class DeploymentService {
    private headers: Headers;
    constructor(private baseUrl: string, private user: string, private key: string) {
        // todo  strip last of base url.
        this.headers = {
            "Mendix-Username": user,
            "Mendix-ApiKey": key,
            "ContentType": "application/json"
        };
    }
    /**
     * Retrieves a specific branch that belongs to the team server project of a specific app which the authenticated user has access to as a regular user.
     * @param appName Subdomain name of an app.
     * @param branchName Name of the branch to get or ‘trunk’ to get the main line.
     */
    getBranch(appName: string, branchName: string): Promise<Branch> {
        // todo move TeamServerServices
        return getRequest<Branch>({
            url: `${this.baseUrl}/apps/${appName}/branches/${branchName}`,
            headers: this.headers
        });
    }

    /**
     * Retrieves all apps which the authenticated user has access to as a regular user. These apps can be found via the “Nodes overview” screen in the Mendix Platform.
     */
    getApps(): Promise<App[]> {
        return getRequest<App[]>({
            url: `${this.baseUrl}/apps/`,
            headers: this.headers
        });
    }

    /**
     * Retrieves a specific environment that is connected to a specific app which the authenticated user has access to as a regular user
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironment(appId: string, mode: EnvironmentMode): Promise<Environment> {
        return getRequest<Environment>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}`,
            headers: this.headers
        });
    }

    /**
     * Retrieves all environments that are connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     */
    getEnvironments(appId: string): Promise<Environment[]> {
        return getRequest<Environment[]>({
            url: `${this.baseUrl}/apps/${appId}/environments/`,
            headers: this.headers
        });
    }

    /**
     * Retrieves a specific app which the authenticated user has access to as a regular user. These app can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     */
    getApp(appId: string): Promise<App[]> {
        return getRequest<App[]>({
            url: `${this.baseUrl}/apps/${appId}`,
            headers: this.headers
        });
    }

    /**
     * Creates a sandbox application for a requested project id.
     * @param projectId The sprintr project identifier that should be linked to the new sandbox application.
     */
    createSandbox(projectId: string): Promise<Sandbox> {
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
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    stopApp(appId: string, mode: EnvironmentMode): Promise<string> {
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/stop`,
            headers: this.headers
        });
    }

    /**
     * Removes all data from a specific environment including files and database records. This action requires the environment to be in “NotRunning” status.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    cleanApp(appId: string, mode: EnvironmentMode): Promise<string> {
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/clean`,
            headers: this.headers
        });
    }

    /**
     * Transports a specific deployment package to a specific environment. This action requires the environment to be in the “NotRunning” status.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param packageId ID of the deployment package
     */
    transportPackage(appId: string, mode: EnvironmentMode, packageId: string): Promise<string> {
        // Check option for transport file?
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
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    startApp(appId: string, mode: EnvironmentMode): Promise<Job> {
        // Check option for transport file?
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
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param jobId The identifier which can be used to track the progress of the start action
     */
    getEnvironmentStartStatus(appId: string, mode: EnvironmentMode, jobId: string): Promise<EnvironmentStatus> {
        return getRequest<EnvironmentStatus>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/start/${jobId}`,
            headers: this.headers
        });
    }

    waitForStart(appId: string, mode: EnvironmentMode, jobId: string, timeOutSeconds: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
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
                            resolve(true);
                        } else {
                            checkStatus();
                        }
                    } catch (startStatusError) {
                        reject(startStatusError);
                    }
                }, 10 * 1000);
            };
            checkStatus();
        });
    }

    waitForSandboxStart(appId: string, timeOutSeconds: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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
                        // console.log(statusCode);
                        if (statusCode === 401) {
                             resolve(true);
                        } else if (statusCode === 503) {
                            process.stdout.write(". ");
                            checkStatus();
                        } else {
                            reject("Error wait for start sandbox " + url + " code: " + statusCode);
                        }
                    } catch (startStatusError) {
                        reject(startStatusError);
                    }
                }, 1000);
            };
            console.log("Wait 60s before build start the transport");
            setTimeout(checkStatus, 60 * 1000);
        });
    }

    getHttpStatusCode(url: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            get(url, (error: any, response: any) => {
                resolve(response.statusCode);
            });
        });
    }

    /**
     * Uploads a deployment package from the local system to a specific app. This package can then be transported to a specific environment for deployment.
     * @param appId Subdomain name of an app.
     * @param filename path and filename.
     */
    uploadPackage(appId: string, filename: string): Promise<Upload> {
        return uploadFile<Upload>({
            url: `${this.baseUrl}/apps/${appId}/packages/upload`,
            headers: this.headers
        }, filename);
    }

    /**
     * Gets current values of custom settings, constants and scheduled events used by the target environment.
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironmentSettings(appId: string, mode: EnvironmentMode): Promise<EnvironmentSettings> {
        return getRequest<EnvironmentSettings>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/settings/`,
            headers: this.headers
        });
    }

    /**
     * Changes value of existing environment settings like custom settings, constants and scheduled events. These changes are applied after restarting the environment.
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    setEnvironmentSettings(appId: string, mode: EnvironmentMode, settings: EnvironmentSettings): Promise<string> {
        return postRequest<string>({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/settings/`,
            headers: this.headers,
            body: JSON.stringify({
                AutoSyncDb : true
            })
        });
    }

    /*
     TODO:
        List Environment Backups
        Download a Backup for an Environment
     */

}
