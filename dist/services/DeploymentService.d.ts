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
export declare type EnvironmentMode = "Sandbox" | "Test" | "Acceptance" | "Production";
export declare class DeploymentService {
    private baseUrl;
    private user;
    private key;
    private headers;
    constructor(baseUrl: string, user: string, key: string);
    /**
     * Retrieves a specific branch that belongs to the team server project of a specific app which the authenticated user has access to as a regular user.
     * @param appName Subdomain name of an app.
     * @param branchName Name of the branch to get or ‘trunk’ to get the main line.
     */
    getBranch(appName: string, branchName: string): Promise<Branch>;
    /**
     * Retrieves all apps which the authenticated user has access to as a regular user. These apps can be found via the “Nodes overview” screen in the Mendix Platform.
     */
    getApps(): Promise<App[]>;
    /**
     * Retrieves a specific environment that is connected to a specific app which the authenticated user has access to as a regular user
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironment(appId: string, mode: EnvironmentMode): Promise<Environment>;
    /**
     * Retrieves all environments that are connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     */
    getEnvironments(appId: string): Promise<Environment[]>;
    /**
     * Retrieves a specific app which the authenticated user has access to as a regular user. These app can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     */
    getApp(appId: string): Promise<App[]>;
    /**
     * Creates a sandbox application for a requested project id.
     * @param projectId The sprintr project identifier that should be linked to the new sandbox application.
     */
    createSandbox(projectId: string): Promise<Sandbox>;
    /**
     * Stops a specific environment that is connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    stopApp(appId: string, mode: EnvironmentMode): Promise<string>;
    /**
     * Removes all data from a specific environment including files and database records. This action requires the environment to be in “NotRunning” status.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    cleanApp(appId: string, mode: EnvironmentMode): Promise<string>;
    /**
     * Transports a specific deployment package to a specific environment. This action requires the environment to be in the “NotRunning” status.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param packageId ID of the deployment package
     */
    transportPackage(appId: string, mode: EnvironmentMode, packageId: string): Promise<string>;
    /**
     * Starts a specific environment that is connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    startApp(appId: string, mode: EnvironmentMode): Promise<Job>;
    /**
     * Retrieve the status of the start environment action.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param jobId The identifier which can be used to track the progress of the start action
     */
    getEnvironmentStartStatus(appId: string, mode: EnvironmentMode, jobId: string): Promise<EnvironmentStatus>;
    waitForStart(appId: string, mode: EnvironmentMode, jobId: string, timeOutSeconds: number): Promise<boolean>;
    waitForSandboxStart(appId: string, timeOutSeconds: number): Promise<boolean>;
    getHttpStatusCode(url: string): Promise<number>;
    /**
     * Uploads a deployment package from the local system to a specific app. This package can then be transported to a specific environment for deployment.
     * @param appId Subdomain name of an app.
     * @param filename path and filename.
     */
    uploadPackage(appId: string, filename: string): Promise<Upload>;
    /**
     * Gets current values of custom settings, constants and scheduled events used by the target environment.
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironmentSettings(appId: string, mode: EnvironmentMode): Promise<EnvironmentSettings>;
    /**
     * Changes value of existing environment settings like custom settings, constants and scheduled events. These changes are applied after restarting the environment.
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    setEnvironmentSettings(appId: string, mode: EnvironmentMode, settings: EnvironmentSettings): Promise<string>;
}
