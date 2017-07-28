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
class BuildService {
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
    downloadPackage(appId, packageId, filename) {
        return Service_1.getFile({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}/download`,
            headers: this.headers
        }, filename);
    }
    deletePackage(appId, packageId) {
        return Service_1.deleteRequest({
            url: `${this.baseUrl}/apps/${appId}/packages/${packageId}`,
            headers: this.headers
        });
    }
}
exports.BuildService = BuildService;
