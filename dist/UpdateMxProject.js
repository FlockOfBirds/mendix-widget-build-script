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
// tslint:disable:rule no-console
const SvnService_1 = require("./SvnService");
const Settings_1 = require("./Settings");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const settings = Settings_1.getSettings();
console.log("Update Mendix project with settings: " + JSON.stringify(settings));
const svn = new SvnService_1.SvnService(settings.projectUrl, settings.user, settings.password, settings.folder.build);
updateProject().then(success => process.exit(0), error => process.exit(1));
function updateProject() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Checking out to " + settings.folder.build);
                yield svn.checkOutBranch(settings.branchName);
                console.log("Copy widget");
                yield copyWidget(path.join(settings.folder.build, "widgets"));
                console.log("create release folder ", settings.folder.release);
                mkdirSync(settings.folder.release);
                yield copyWidget(settings.folder.release);
                console.log("Zip project .mpk");
                yield zipFolder(settings.folder.build, path.resolve(settings.folder.release, settings.testProjectName));
                console.log("Committing changes");
                const changedFile = path.join(settings.folder.build, "widgets", settings.widget.name + ".mpk");
                yield svn.commit(changedFile, "CI script commit");
                console.log("Done");
                resolve(true);
            }
            catch (error) {
                console.error("Error updating Mendix project", error);
                reject(error);
            }
        }));
    });
}
function copyWidget(destination) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const filename = settings.widget.name + ".mpk";
            const source = path.join(settings.folder.dist, settings.widget.version, filename);
            fs.access(destination, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    fs.mkdirSync(destination);
                }
                try {
                    yield copyFile(source, path.join(destination, filename));
                    resolve(true);
                }
                catch (copyError) {
                    reject(copyError);
                }
            }));
        });
    });
}
function copyFile(source, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(source);
            readStream.once("error", error => {
                reject(error);
            });
            readStream.once("end", () => {
                console.log("done copying");
                resolve(true);
            });
            readStream.pipe(fs.createWriteStream(destination));
        });
    });
}
const mkdirSync = (dirPath) => {
    try {
        fs.mkdirSync(dirPath);
    }
    catch (error) {
        if (error.code !== "EEXIST")
            throw error;
    }
};
function zipFolder(source, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(destination);
            const archive = archiver("zip");
            output.on("close", () => {
                console.log(archive.pointer() + " total bytes");
                console.log("archiver has been finalized and the output file descriptor has closed.");
                resolve(true);
            });
            archive.on("error", error => {
                reject(error);
            });
            archive.pipe(output);
            archive.directory(source, "/");
            archive.finalize();
        });
    });
}
