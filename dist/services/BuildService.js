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
const Service_1 = require("./Service");
/**
 * The Build API allows you to manage deployment packages and create new deployment packages using our build server. You will need the information from the Teamserver API as input for these API calls.
 * Based on https://docs.mendix.com/apidocs-mxsdk/apidocs/build-api
 */
class BuildService {
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
     * Start the process to build a deployment package, based on the team server project of a specific app that the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the Nodes screen in the Mendix Platform. For a Sandbox, this will also trigger a deployment of the new package.
     * @param appId Subdomain name of an app.
     * @param branchName Name of the branch. This is ‘trunk’ for the main line or a specific branch name.
     * @param revision Number of the revision to build a package from.
     * @param version Package version. This will also be the name of the tag on the project team server.
     */
    startBuild(appId, branchName, revision, version) {
        const currentDate = new Date();
        const timeStamp = currentDate.getFullYear() + "-"
            + (currentDate.getMonth() + 1) + "-"
            + currentDate.getDate() + " "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();
        return Service_1.postRequest({
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
     * @param appId Subdomain name of an app.
     * @param packageId Unique identification of the package that build
     * @param timeOutSeconds maximum waiting time for build to complete.
     */
    waitForBuild(appId, packageId, timeOutSeconds) {
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
                        const deployPackage = yield this.getPackage(appId, packageId);
                        if (deployPackage.Status === "Succeeded") {
                            console.log("Build completed");
                            resolve(deployPackage);
                        }
                        else if (deployPackage.Status === "Failed") {
                            reject("Build status is 'Failed' check the 'Latest build output' on https://cloud.home.mendix.com DEPLOY > Environments");
                        }
                        else {
                            process.stdout.write(". ");
                            checkStatus();
                        }
                    }
                    catch (getPackageError) {
                        reject(getPackageError);
                    }
                }), 10 * 1000);
            };
            process.stdout.write(". ");
            checkStatus();
        });
    }
    /**
     * Retrieves a specific deployment package that is available for a specific app which the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the “Nodes overview” screen in the Mendix Platform.
     * @param appId Subdomain name of an app.
     * @param packageId Id of the deployment package.
     */
    getPackage(appId, packageId) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}/`,
            headers: this.headers
        });
    }
    /**
     * Retrieves all deployment packages that are available for a specific app which the authenticated user has access to as a regular user. These packages can be found if you click Details on an app in the “Nodes overview” screen in the Mendix Platform.
     * @param appId Subdomain name of an app.
     */
    getPackages(appId) {
        return Service_1.getRequest({
            url: `${this.baseUrl}/apps/${appId}/packages/`,
            headers: this.headers
        });
    }
    /**
     * Downloads a specific deployment package that is available for a specific app that the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the Nodes screen in the Mendix Platform.
     * @param appId Subdomain name of an app.
     * @param packageId Id of the deployment package.
     * @param filename full path and filename where the downloaded file needs to be stored
     */
    downloadPackage(appId, packageId, filename) {
        return Service_1.getFile({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}/download`,
            headers: this.headers
        }, filename);
    }
    /**
     * Deletes a specific deployment package that is available for a specific app that the authenticated user has access to as a regular user. This package can be found if you click Details on an app in the Nodes screen in the Mendix Platform.
     * @param appId Subdomain name of an app.
     * @param packageId Id of the deployment package.
     */
    deletePackage(appId, packageId) {
        return Service_1.deleteRequest({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}`,
            headers: this.headers
        });
    }
}
exports.BuildService = BuildService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVpbGRTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0J1aWxkU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsdUNBQTRFO0FBc0I1RTs7O0dBR0c7QUFDSDtJQUlJLFlBQW9CLElBQVksRUFBVSxHQUFXO1FBQWpDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBRjdDLFlBQU8sR0FBRyxpQ0FBaUMsQ0FBQztRQUdoRCxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsZUFBZSxFQUFFLEdBQUc7WUFDcEIsYUFBYSxFQUFFLGtCQUFrQjtTQUNwQyxDQUFDO0lBQ04sQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFXO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxVQUFVLENBQUMsS0FBYSxFQUFFLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxPQUFlO1FBQzNFLE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUc7Y0FDL0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRztjQUNsQyxXQUFXLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRztjQUMzQixXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRztjQUM1QixXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsR0FBRztjQUM5QixXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDM0MsTUFBTSxDQUFDLHFCQUFXLENBQVE7WUFDdEIsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFlBQVk7WUFD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