// tslint:disable:rule no-angle-bracket-type-assertion max-line-length
import { Headers, RequestAPI, del, get, post } from "request";
import * as fs from "fs";

interface ServiceError {
    errorMessage: string;
    errorCode: string;
}

export function getRequest<T>(opts: any) {
    return new Promise<T>((resolve, reject) => {
        get(opts, (error: any, response: any, body: any) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = <ServiceError>parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            } else {
                resolve(parsedBody);
            }
        });
    });
}

export function postRequest<T>(opts: any) {
    return new Promise<T>((resolve, reject) => {
        post(opts, (error: any, response: any, body: any) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = <ServiceError>parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            } else {
                resolve(parsedBody);
            }
        });
    });
}

export function deleteRequest<T>(opts: any) {
    return new Promise<T>((resolve, reject) => {
        del(opts, (error: any, response: any, body: any) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = <ServiceError>parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            } else {
                resolve(parsedBody);
            }
        });
    });
}

export function getFile(opts: any, filename: string) {
    return new Promise<string>((resolve, reject) => {
        // opts.encoding = null;
        get(opts, (error: any, response: any, body: any) => {
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const parsedBody = JSON.parse(body);
                const errorDetails = <ServiceError>parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            } else {
                fs.writeFile(filename, body, writeError => {
                    if (!writeError) {
                        resolve("file written!");
                    } else {
                        reject("failed writing file");
                    }
                });
            }
        });
    });
}

export function uploadFile<T>(opts: any, filename: string) {
    return new Promise<T>((resolve, reject) => {
        // opts.encoding = null;
        opts.body = fs.createReadStream(filename);
        post(opts, (error: any, response: any, body: any) => {
            const parsedBody = JSON.parse(body);
            if (error || response.statusCode < 200 || response.statusCode > 300) {
                const errorDetails = <ServiceError>parsedBody;
                reject(`failed with code ${response.statusCode}:\n${errorDetails.errorMessage}\n${errorDetails.errorCode}`);
            } else {
                resolve(parsedBody);
            }
        });
    });
}
