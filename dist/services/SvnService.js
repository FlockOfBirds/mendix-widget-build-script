"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svnUltimate = require("node-svn-ultimate");
class SvnService {
    constructor(username, password, destination) {
        this.username = username;
        this.password = password;
        this.destination = destination;
        this.baseUrl = "https://teamserver.sprintr.com";
    }
    checkOutBranch(projectId, branch) {
        const branchUrl = this.getBranchUrl(projectId, branch);
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
    setBaseUrl(url) {
        this.baseUrl = url;
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
    createBranch(projectId, sourceBranch, targetBranch, message) {
        const sourceUrl = this.getBranchUrl(projectId, sourceBranch);
        const targetUrl = this.getBranchUrl(projectId, targetBranch);
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
    getBranchUrl(projectId, branch) {
        return branch === "trunk" ? `${this.baseUrl}/${projectId}/${branch}` : `${this.baseUrl}/${projectId}/branches/${branch}`;
    }
}
exports.SvnService = SvnService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ZuU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Tdm5TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWlEO0FBRWpEO0lBR0ksWUFBb0IsUUFBZ0IsRUFBVSxRQUFnQixFQUFVLFdBQVc7UUFBL0QsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBQTtRQUQzRSxZQUFPLEdBQUcsZ0NBQWdDLENBQUM7SUFDbUMsQ0FBQztJQUV2RixjQUFjLENBQUMsU0FBaUIsRUFBRSxNQUFjO1FBQzVDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBVSxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3hDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUN2RCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTthQUMxQixFQUFFLENBQUMsS0FBSztnQkFDTCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsT0FBTyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2YsTUFBTSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO1lBQ0wsQ0FBQyxDQUFFLENBQUM7UUFDUixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxVQUFVLENBQUMsR0FBVztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUN2QixDQUFDO0lB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