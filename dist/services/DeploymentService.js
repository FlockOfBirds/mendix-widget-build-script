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
const request_1 = require("request");
const Service_1 = require("./Service");
/**
 * The Deploy API allows you to manage application environments in our public cloud. You can retrieve the status, start and stop applications, but also deploy and transport new model versions to application environments. To do the latter you will also need the Build API to create and manage deployment packages.
 * Based on https://docs.mendix.com/apidocs-mxsdk/apidocs/deploy-api
 */
class DeploymentService {
    constructor(user, key) {
        this.user = user;
        this.key = key;
        this.baseUrl = "https://deploy.mendix.com/api/1";
        // todo  strip last of base url.
        this.headers = {
            "Mendix-Username": user,
            "Mendix-ApiKey": key,
            "ContentType": "application/json"
        };
    }
    setBaseUrl(url) {
        this.baseUrl = url;
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
    /**
     * Wait for starting environment action returns the EnvironmentStatus
     * @param appId Sub-domain name of an app.
     * @param mode Mode of the environment. Possible values: Test, Acceptance, Production.
     * @param jobId The identifier which can be used to track the progress of the start action
     * @param timeOutSeconds The time in seconds before waiting to start will stop polling
     */
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
                            resolve(startStatus);
                        }
                        else if (startStatus.Status === "Starting") {
                            checkStatus();
                        }
                        else {
                            reject("Starting failed for unknown reason");
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
    /**
     * Wait for sandbox environment startup after build. Build automatically startup deployment to the sandbox
     * @param appId Sub-domain name of an app.
     * @param timeOutSeconds The time in seconds before waiting to start will stop polling.
     */
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
    /**
     * Get the response code for a request to an URL
     * @param url full URL to test
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVwbG95bWVudFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvRGVwbG95bWVudFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFDQUF5RDtBQUN6RCx1Q0FBZ0U7QUFvRWhFOzs7R0FHRztBQUNIO0lBR0ksWUFBb0IsSUFBWSxFQUFVLEdBQVc7UUFBakMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFEN0MsWUFBTyxHQUFHLGlDQUFpQyxDQUFDO1FBRWhELGdDQUFnQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixlQUFlLEVBQUUsR0FBRztZQUNwQixhQUFhLEVBQUUsa0JBQWtCO1NBQ3BDLENBQUM7SUFDTixDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVc7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxTQUFTLENBQUMsT0FBZSxFQUFFLFVBQWtCO1FBQ3pDLCtCQUErQjtRQUMvQixNQUFNLENBQUMsb0JBQVUsQ0FBUztZQUN0QixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxTQUFTLE9BQU8sYUFBYSxVQUFVLEVBQUU7WUFDN0QsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU87UUFDSCxNQUFNLENBQUMsb0JBQVUsQ0FBUTtZQUNyQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxRQUFRO1lBQzVCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxLQUFhLEVBQUUsSUFBcUI7UUFDL0MsTUFBTSxDQUFDLG9CQUFVLENBQWM7WUFDM0IsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLGlCQUFpQixJQUFJLEVBQUU7WUFDekQsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7O09BR0c7SUFDSCxlQUFlLENBQUMsS0FBYTtRQUN6QixNQUFNLENBQUMsb0JBQVUsQ0FBZ0I7WUFDN0IsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLGdCQUFnQjtZQUNsRCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDeEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxLQUFhO1FBQ2hCLE1BQU0sQ0FBQyxvQkFBVSxDQUFRO1lBQ3JCLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxFQUFFO1lBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsYUFBYSxDQUFDLFNBQWlCO1FBQzNCLE1BQU0sQ0FBQyxxQkFBVyxDQUFVO1lBQ3hCLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLFFBQVE7WUFDNUIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQixTQUFTLEVBQUUsU0FBUzthQUN2QixDQUFDO1NBQ0wsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsS0FBYSxFQUFFLElBQXFCO1FBQ3hDLE1BQU0sQ0FBQyxxQkFBVyxDQUFTO1lBQ3ZCLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxpQkFBaUIsSUFBSSxPQUFPO1lBQzlELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxLQUFhLEVBQUUsSUFBcUI7UUFDekMsTUFBTSxDQUFDLHFCQUFXLENBQVM7WUFDdkIsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLGlCQUFpQixJQUFJLFFBQVE7WUFDL0QsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGdCQUFnQixDQUFDLEtBQWEsRUFBRSxJQUFxQixFQUFFLFNBQWlCO1FBQ3BFLG1DQUFtQztRQUNuQyxNQUFNLENBQUMscUJBQVcsQ0FBUztZQUN2QixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssaUJBQWlCLElBQUksWUFBWTtZQUNuRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLFNBQVMsRUFBRSxTQUFTO2FBQ3ZCLENBQUM7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxLQUFhLEVBQUUsSUFBcUI7UUFDekMsbUNBQW1DO1FBQ25DLE1BQU0sQ0FBQyxxQkFBVyxDQUFNO1lBQ3BCLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxpQkFBaUIsSUFBSSxRQUFRO1lBQy9ELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDakIsVUFBVSxFQUFHLElBQUk7YUFDcEIsQ0FBQztTQUNMLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILHlCQUF5QixDQUFDLEtBQWEsRUFBRSxJQUFxQixFQUFFLEtBQWE7UUFDekUsTUFBTSxDQUFDLG9CQUFVLENBQW9CO1lBQ2pDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxpQkFBaUIsSUFBSSxVQUFVLEtBQUssRUFBRTtZQUN4RSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDeEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFlBQVksQ0FBQyxLQUFhLEVBQUUsSUFBcUIsRUFBRSxLQUFhLEVBQUUsY0FBc0I7UUFDcEYsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFvQixDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2xELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN4QixNQUFNLFdBQVcsR0FBRztnQkFDaEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUU1QyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLHlCQUF5QixjQUFjLEVBQUUsQ0FBQyxDQUFDO29CQUNsRCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxVQUFVLENBQUM7b0JBQ1AsSUFBSSxDQUFDO3dCQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBRTdFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFDbkMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUN6QixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLFdBQVcsRUFBRSxDQUFDO3dCQUNsQixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLE1BQU0sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO3dCQUNqRCxDQUFDO29CQUNMLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDN0IsQ0FBQztnQkFDTCxDQUFDLENBQUEsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDO1lBQ0YsV0FBVyxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILG1CQUFtQixDQUFDLEtBQWEsRUFBRSxjQUFzQjtRQUNyRCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVUsQ0FBTyxPQUFPLEVBQUUsTUFBTTtZQUM5QyxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1lBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN4QixNQUFNLFdBQVcsR0FBRztnQkFDaEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUU1QyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLG9DQUFvQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO29CQUM3RCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxVQUFVLENBQUM7b0JBQ1AsSUFBSSxDQUFDO3dCQUNELE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNyRCwyQkFBMkI7d0JBQzNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ25CLENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDM0IsV0FBVyxFQUFFLENBQUM7d0JBQ2xCLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osTUFBTSxDQUFDLCtCQUErQixHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUM7d0JBQzNFLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUM3QixDQUFDO2dCQUNMLENBQUMsQ0FBQSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3pELFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQWlCLENBQUMsR0FBVztRQUN6QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUN2QyxhQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBVSxFQUFFLFFBQWE7Z0JBQy9CLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLEtBQWEsRUFBRSxRQUFnQjtRQUN6QyxNQUFNLENBQUMsb0JBQVUsQ0FBUztZQUN0QixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssa0JBQWtCO1lBQ3BELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsc0JBQXNCLENBQUMsS0FBYSxFQUFFLElBQXFCO1FBQ3ZELE1BQU0sQ0FBQyxvQkFBVSxDQUFzQjtZQUNuQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssaUJBQWlCLElBQUksWUFBWTtZQUNuRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDeEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxzQkFBc0IsQ0FBQyxLQUFhLEVBQUUsSUFBcUIsRUFBRSxRQUE2QjtRQUN0RixNQUFNLENBQUMscUJBQVcsQ0FBUztZQUN2QixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssaUJBQWlCLElBQUksWUFBWTtZQUNuRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLFVBQVUsRUFBRyxJQUFJO2FBQ3BCLENBQUM7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBUUo7QUFsU0QsOENBa1NDIn0=