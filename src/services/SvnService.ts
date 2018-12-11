///<reference path="../../typings/node-svn-ultimate.d.ts" />

import * as svnUltimate from "node-svn-ultimate";

export class SvnService {
    /**
     * Log the service calls to the console.
     */
    showLog = true;
    private baseUrl = "https://teamserver.sprintr.com";

    constructor(private username: string, private password: string, private destination: string) {}

    checkOutBranch(projectId: string, branch: string) {
        const branchUrl = this.getBranchUrl(projectId, branch);
        this.log(`Checking out ${branchUrl} to ${this.destination}`);
        return new Promise<void>((resolve, reject) => {
            svnUltimate.commands.checkout(branchUrl, this.destination, {
                username: this.username,
                password: this.password
            }, (error) => {
                if (!error) {
                    resolve();
                } else {
                    this.cleanup();
                    reject("failed to checkout" + error);
                }
            });
        });
    }

    /**
     * Overwrite the default API RUL
     * @param url - The URL to the Mendix API
     */
    setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    cleanup() {
        this.log(`Clean up working copy ${this.destination}`);
        return new Promise<void>((resolve, reject) => {
            svnUltimate.commands.cleanup(this.destination, {}, (error) => {
                if (!error) {
                    resolve();
                } else {
                    reject("failed to cleanup " + this.destination + error);
                }
            });
        });
    }

    status() {
        this.log(`Get working copy status of ${this.destination}`);
        return new Promise<any>((resolve, reject) => {
            svnUltimate.commands.status(this.destination, {}, (error, data) => {
                this.log("status", data);
                // console.log("status", data.target.entry.$.path, data.target.entry["wc-status"].$.item);
                if (!error) {
                    resolve(data);
                } else {
                    reject("failed to status " + this.destination + error);
                }
            });
        });
    }

    commit(files: string[], message: string) {
        this.log(`Committing changes ${files} message: ${message}`);
        return new Promise<void>((resolve, reject) => {
            svnUltimate.commands.commit(files, {
                username: this.username,
                password: this.password,
                params: [ `-m "${message}"` ]
            }, (error) => {
                if (!error) {
                    resolve();
                } else {
                    reject("failed to commit " + files.join(", ") + " " + error);
                }
            });
        });
    }

    createBranch(projectId: string, sourceBranch: string, targetBranch: string, message: string) {
        const sourceUrl = this.getBranchUrl(projectId, sourceBranch);
        const targetUrl = this.getBranchUrl(projectId, targetBranch);
        this.log(`Create branch copy from ${sourceUrl} to: ${targetUrl}`);
        return new Promise<void>((resolve, reject) => {
            svnUltimate.commands.copy(sourceUrl, targetUrl, {
                username: this.username,
                password: this.password,
                params: [ `-m "${message}"` ]
            }, (error) => {
                if (!error) {
                    resolve();
                } else {
                    reject(`failed to copy ${sourceUrl} to ${targetUrl}: ${error}`);
                }
            });
        });
    }

    private getBranchUrl(projectId: string, branch: string): string {
        return branch === "trunk" ? `${this.baseUrl}/${projectId}/${branch}` : `${this.baseUrl}/${projectId}/branches/${branch}`;
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
