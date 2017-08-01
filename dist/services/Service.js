"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("request");
const fs = require("fs");
function getRequest(opts) {
    return new Promise((resolve, reject) => {
        request_1.get(opts, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            }
            else {
                resolve(parsedBody);
            }
        });
    });
}
exports.getRequest = getRequest;
function postRequest(opts) {
    return new Promise((resolve, reject) => {
        request_1.post(opts, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            }
            else {
                resolve(parsedBody);
            }
        });
    });
}
exports.postRequest = postRequest;
function deleteRequest(opts) {
    return new Promise((resolve, reject) => {
        request_1.del(opts, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            }
            else {
                resolve(parsedBody);
            }
        });
    });
}
exports.deleteRequest = deleteRequest;
function getFile(opts, filename) {
    return new Promise((resolve, reject) => {
        // opts.encoding = null;
        request_1.get(opts, (error, response, body) => {
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const parsedBody = JSON.parse(body);
                const errorDetails = parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            }
            else {
                fs.writeFile(filename, body, writeError => {
                    if (!writeError) {
                        resolve("file written!");
                    }
                    else {
                        reject("failed writing file");
                    }
                });
            }
        });
    });
}
exports.getFile = getFile;
function uploadFile(opts, filename) {
    return new Promise((resolve, reject) => {
        // opts.encoding = null;
        opts.body = fs.createReadStream(filename);
        request_1.post(opts, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            }
            else {
                resolve(parsedBody);
            }
        });
    });
}
exports.uploadFile = uploadFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQThEO0FBQzlELHlCQUF5QjtBQU96QixvQkFBOEIsSUFBUztJQUNuQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTTtRQUNsQyxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQzNDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsTUFBTSxZQUFZLEdBQWlCLFVBQVUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLG9CQUFvQixRQUFRLENBQUMsVUFBVSxNQUFNLFlBQVksQ0FBQyxZQUFZLEtBQUssWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDaEgsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFaRCxnQ0FZQztBQUVELHFCQUErQixJQUFTO0lBQ3BDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBSSxDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2xDLGNBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFVLEVBQUUsUUFBYSxFQUFFLElBQVM7WUFDNUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxNQUFNLFlBQVksR0FBaUIsVUFBVSxDQUFDO2dCQUM5QyxNQUFNLENBQUMsb0JBQW9CLFFBQVEsQ0FBQyxVQUFVLE1BQU0sWUFBWSxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNoSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVpELGtDQVlDO0FBRUQsdUJBQWlDLElBQVM7SUFDdEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFJLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDbEMsYUFBRyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQVUsRUFBRSxRQUFhLEVBQUUsSUFBUztZQUMzQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLE1BQU0sWUFBWSxHQUFpQixVQUFVLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxvQkFBb0IsUUFBUSxDQUFDLFVBQVUsTUFBTSxZQUFZLENBQUMsWUFBWSxLQUFLLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ2hILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBWkQsc0NBWUM7QUFFRCxpQkFBd0IsSUFBUyxFQUFFLFFBQWdCO0lBQy9DLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ3ZDLHdCQUF3QjtRQUN4QixhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sWUFBWSxHQUFpQixVQUFVLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxvQkFBb0IsUUFBUSxDQUFDLFVBQVUsTUFBTSxZQUFZLENBQUMsWUFBWSxLQUFLLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ2hILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVTtvQkFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNkLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDN0IsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztvQkFDbEMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQW5CRCwwQkFtQkM7QUFFRCxvQkFBOEIsSUFBUyxFQUFFLFFBQWdCO0lBQ3JELE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBSSxDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2xDLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxjQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQzVDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsTUFBTSxZQUFZLEdBQWlCLFVBQVUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLG9CQUFvQixRQUFRLENBQUMsVUFBVSxNQUFNLFlBQVksQ0FBQyxZQUFZLEtBQUssWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDaEgsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFkRCxnQ0FjQyJ9