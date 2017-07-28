"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:rule no-angle-bracket-type-assertion max-line-length
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
