"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
const svnUltimate = require("node-svn-ultimate");
class SvnService {
    constructor(baseUrl, username, password, destination) {
        this.baseUrl = baseUrl;
        this.username = username;
        this.password = password;
        this.destination = destination;
    }
    checkOutBranch(branch) {
        const branchUrl = this.getBranchUrl(branch);
        return new Promise((resolve, reject) => {
            svnUltimate.commands.checkout(branchUrl, this.destination, {
                username: this.username,
                password: this.password
            }, (error) => {
                if (!error) {
                    resolve();
                }
                else {
                    this.cleanup();
                    reject("failed to checkout" + error);
                }
            });
        });
    }
    cleanup() {
        return new Promise((resolve, reject) => {
            svnUltimate.commands.cleanup(this.destination, {}, (error) => {
                if (!error) {
                    resolve();
                }
                else {
                    reject("failed to cleanup " + this.destination + error);
                }
            });
        });
    }
    status() {
        return new Promise((resolve, reject) => {
            svnUltimate.commands.status(this.destination, {}, (error, data) => {
                console.log("status", data);
                // console.log("status", data.target.entry.$.path, data.target.entry["wc-status"].$.item);
                if (!error) {
                    resolve();
                }
                else {
                    reject("failed to status " + this.destination + error);
                }
            });
        });
    }
    commit(files, message) {
        return new Promise((resolve, reject) => {
            svnUltimate.commands.commit(files, {
                username: this.username,
                password: this.password,
                params: [`-m "${message}"`]
            }, (error) => {
                if (!error) {
                    resolve();
                }
                else {
                    reject("failed to commit " + files + " " + error);
                }
            });
        });
    }
    createBranch(sourceBranch, targetBranch, message) {
        const sourceUrl = this.getBranchUrl(sourceBranch);
        const targetUrl = this.getBranchUrl(targetBranch);
        return new Promise((resolve, reject) => {
            svnUltimate.commands.copy(sourceUrl, targetUrl, {
                username: this.username,
                password: this.password,
                params: [`-m "${message}"`]
            }, (error) => {
                if (!error) {
                    resolve();
                }
                else {
                    reject(`failed to copy ${sourceUrl} to ${targetUrl}: ${error}`);
                }
            });
        });
    }
    checkBranchExists(sourceBranch) {
    }
    getBranchUrl(branch) {
        return branch === "trunk" ? `${this.baseUrl}/${branch}` : `${this.baseUrl}/branches/${branch}`;
    }
}
exports.SvnService = SvnService;
