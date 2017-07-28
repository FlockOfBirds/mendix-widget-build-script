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
// tslint:disable:rule object-literal-sort-keys max-line-length no-console
const request_1 = require("request");
const Service_1 = require("./Service");
class DeploymentService {
    constructor(baseUrl, user, key) {
        this.baseUrl = baseUrl;
        this.user = user;
        this.key = key;
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
    getBranch(appName, branchName) {
        // todo move TeamServerServices
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appName}/branches/${branchName}`,
            headers: this.headers
        });
    }
    /**
     * Retrieves all apps which the authenticated user has access to as a regular user. These apps can be found via the “Nodes overview” screen in the Mendix Platform.
     */
    getApps() {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/`,
            headers: this.headers
        });
    }
    /**
     * Retrieves a specific environment that is connected to a specific app which the authenticated user has access to as a regular user
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironment(appId, mode) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}`,
            headers: this.headers
        });
    }
    /**
     * Retrieves all environments that are connected to a specific app which the authenticated user has access to as a regular user. These environments can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     */
    getEnvironments(appId) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/`,
            headers: this.headers
        });
    }
    /**
     * Retrieves a specific app which the authenticated user has access to as a regular user. These app can be found via the “Nodes overview” screen in the Mendix Platform.
     * @param appId Sub-domain name of an app.
     */
    getApp(appId) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}`,
            headers: this.headers
        });
    }
    /**
     * Creates a sandbox application for a requested project id.
     * @param projectId The sprintr project identifier that should be linked to the new sandbox application.
     */
    createSandbox(projectId) {
        return Service_1.postRequest({
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
    stopApp(appId, mode) {
        return Service_1.postRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/stop`,
            headers: this.headers
        });
    }
    /**
     * Removes all data from a specific environment including files and database records. This action requires the environment to be in “NotRunning” status.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     */
    cleanApp(appId, mode) {
        return Service_1.postRequest({
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
    transportPackage(appId, mode, packageId) {
        // Check option for transport file?
        return Service_1.postRequest({
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
    startApp(appId, mode) {
        // Check option for transport file?
        return Service_1.postRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/start`,
            headers: this.headers,
            body: JSON.stringify({
                AutoSyncDb: true
            })
        });
    }
    /**
     * Retrieve the status of the start environment action.
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param jobId The identifier which can be used to track the progress of the start action
     */
    getEnvironmentStartStatus(appId, mode, jobId) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/start/${jobId}`,
            headers: this.headers
        });
    }
    waitForStart(appId, mode, jobId, timeOutSeconds) {
        return new Promise((resolve, reject) => {
            const date = Date.now();
            const checkStatus = () => {
                const duration = (Date.now() - date) / 1000;
                if (duration > timeOutSeconds) {
                    reject(`Build timed out after ${timeOutSeconds}`);
                    return;
                }
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const startStatus = yield this.getEnvironmentStartStatus(appId, mode, jobId);
                        if (startStatus.Status === "Started") {
                            resolve(true);
                        }
                        else {
                            checkStatus();
                        }
                    }
                    catch (startStatusError) {
                        reject(startStatusError);
                    }
                }), 10 * 1000);
            };
            checkStatus();
        });
    }
    waitForSandboxStart(appId, timeOutSeconds) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const environmentInfo = yield this.getEnvironment(appId, "Sandbox");
            const url = environmentInfo.Url + "/xas/";
            const date = Date.now();
            const checkStatus = () => {
                const duration = (Date.now() - date) / 1000;
                if (duration > timeOutSeconds) {
                    reject(`Sandbox starting timed out after ${timeOutSeconds}`);
                    return;
                }
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const statusCode = yield this.getHttpStatusCode(url);
                        // console.log(statusCode);
                        if (statusCode === 401) {
                            resolve(true);
                        }
                        else if (statusCode === 503) {
                            process.stdout.write(". ");
                            checkStatus();
                        }
                        else {
                            reject("Error wait for start sandbox " + url + " code: " + statusCode);
                        }
                    }
                    catch (startStatusError) {
                        reject(startStatusError);
                    }
                }), 1000);
            };
            console.log("Wait 60s before build start the transport");
            setTimeout(checkStatus, 60 * 1000);
        }));
    }
    getHttpStatusCode(url) {
        return new Promise((resolve, reject) => {
            request_1.get(url, (error, response) => {
                resolve(response.statusCode);
            });
        });
    }
    /**
     * Uploads a deployment package from the local system to a specific app. This package can then be transported to a specific environment for deployment.
     * @param appId Subdomain name of an app.
     * @param filename path and filename.
     */
    uploadPackage(appId, filename) {
        return Service_1.uploadFile({
            url: `${this.baseUrl}/apps/${appId}/packages/upload`,
            headers: this.headers
        }, filename);
    }
    /**
     * Gets current values of custom settings, constants and scheduled events used by the target environment.
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    getEnvironmentSettings(appId, mode) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/settings/`,
            headers: this.headers
        });
    }
    /**
     * Changes value of existing environment settings like custom settings, constants and scheduled events. These changes are applied after restarting the environment.
     * @param appId Sub-domain name of an app.
     * @param mode The mode of the environment of the app. An environment with this mode should exist.
     */
    setEnvironmentSettings(appId, mode, settings) {
        return Service_1.postRequest({
            url: `${this.baseUrl}/apps/${appId}/environments/${mode}/settings/`,
            headers: this.headers,
            body: JSON.stringify({
                AutoSyncDb: true
            })
        });
    }
}
exports.DeploymentService = DeploymentService;
