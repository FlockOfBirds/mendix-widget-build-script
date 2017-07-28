// tslint:disable
import * as svnUltimate from "node-svn-ultimate";

export class SvnService {
    private branchUrl
    constructor(private baseUrl: string, private username: string, private password: string, private destination) {
    }

    checkOutBranch(branch: string) {
        const branchUrl = this.getBranchUrl(branch);
        return new Promise<boolean>((resolve, reject) => {
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
            } );
        });
    }

    cleanup() {
        return new Promise((resolve, reject) => {
            svnUltimate.commands.cleanup(this.destination, {}, (error) => {
                if (!error) {
                    resolve();
                } else {
                    reject("failed to cleanup " + this.destination + error);
                }
            } );
        });
    }

    status() {
        return new Promise((resolve, reject) => {
            svnUltimate.commands.status(this.destination, {}, (error, data) => {
                console.log("status", data);
                // console.log("status", data.target.entry.$.path, data.target.entry["wc-status"].$.item);
                if (!error) {
                    resolve();
                } else {
                    reject("failed to status " + this.destination + error);
                }
            } );
        });
    }

    commit(files: string, message: string) {
        return new Promise((resolve, reject) => {
            svnUltimate.commands.commit(files, {
                username: this.username,
                password: this.password,
                params: [ `-m "${message}"` ]
            }, (error) => {
                if (!error) {
                    resolve();
                } else {
                    reject("failed to commit " + files + " " + error);
                }
            } );
        });
    }

    createBranch(sourceBranch: string, targetBranch: string, message: string ) {
        const sourceUrl = this.getBranchUrl(sourceBranch);
        const targetUrl = this.getBranchUrl(targetBranch);
        return new Promise((resolve, reject) => {
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
            } );
        });
    }

    checkBranchExists(sourceBranch) {

    }

    private getBranchUrl(branch: string): string{
        return branch === "trunk" ? `${this.baseUrl}/${branch}` : `${this.baseUrl}/branches/${branch}`;
    }
}
