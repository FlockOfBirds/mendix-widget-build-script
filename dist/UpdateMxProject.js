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
const SvnService_1 = require("./services/SvnService");
const Settings_1 = require("./Settings");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const settings = Settings_1.getSettings();
console.log("Update Mendix project with settings: " + JSON.stringify(settings));
const svn = new SvnService_1.SvnService(settings.user, settings.password, settings.folder.build);
if (settings.teamServerUrl) {
    svn.setBaseUrl(settings.teamServerUrl);
}
updateProject().then(success => process.exit(0), error => process.exit(1));
function updateProject() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Checking out to " + settings.folder.build);
                yield svn.checkOutBranch(settings.projectId, settings.branchName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXBkYXRlTXhQcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1VwZGF0ZU14UHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsc0RBQW1EO0FBQ25ELHlDQUF5QztBQUN6Qyx5QkFBeUI7QUFDekIscUNBQXFDO0FBQ3JDLDZCQUE2QjtBQUU3QixNQUFNLFFBQVEsR0FBRyxzQkFBVyxFQUFFLENBQUM7QUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFFaEYsTUFBTSxHQUFHLEdBQUcsSUFBSSx1QkFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFFRCxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUzRTs7UUFDSSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVUsQ0FBTyxPQUFPLEVBQUUsTUFBTTtZQUM5QyxJQUFJLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxH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