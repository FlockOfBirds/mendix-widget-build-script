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
export declare class BuildService {
    private baseUrl;
    private user;
    private key;
    private headers;
    constructor(baseUrl: string, user: string, key: string);
    startBuild(appId: string, branchName: string, revision: string, version: string): Promise<Build>;
    waitForBuild(appId: string, packageId: string, timeOutSeconds: number): Promise<Package>;
    /**
     * Retrieves a specific deployment package that is available for a specific app which the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the “Nodes overview” screen in the Mendix Platform.
     * @param appId Subdomain name of an app.
     * @param packageId Id of the deployment package.
     */
    getPackage(appId: string, packageId: string): Promise<Package>;
    /**
     * Retrieves all deployment packages that are available for a specific app which the authenticated user has access to as a regular user. These packages can be found if you click Details on an app in the “Nodes overview” screen in the Mendix Platform.
     * @param appId Subdomain name of an app.
     */
    getPackages(appId: string): Promise<Package[]>;
    downloadPackage(appId: string, packageId: string, filename: string): Promise<string>;
    deletePackage(appId: string, packageId: string): Promise<string>;
}
