import { SvnService } from "./services/SvnService";
import { getSettings } from "./Settings";
import * as fs from "fs";
import * as archiver from "archiver";
import * as path from "path";

const settings = getSettings();
console.log("Update Mendix project with settings: " + JSON.stringify(settings));

const svn = new SvnService(settings.user, settings.password, settings.folder.build);
if (settings.teamServerUrl) {
    svn.setBaseUrl(settings.teamServerUrl);
}

updateProject().then(success => process.exit(0), error => process.exit(1));

async function updateProject() {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            console.log("Checking out to " + settings.folder.build);
            await svn.checkOutBranch(settings.projectId, settings.branchName);
            console.log("Copy widget");
            await copyWidget(path.join(settings.folder.build, "widgets"));
            console.log("create release folder ", settings.folder.release);
            mkdirSync(settings.folder.release);
            await copyWidget(settings.folder.release);
            console.log("Zip project .mpk");
            await zipFolder(settings.folder.build, path.resolve(settings.folder.release, settings.testProjectName));
            console.log("Committing changes");
            const changedFile = path.join(settings.folder.build, "widgets", settings.widget.name + ".mpk");
            await svn.commit(changedFile, "CI script commit");
            console.log("Done");
            resolve(true);
        } catch (error) {
            console.error("Error updating Mendix project", error);
            reject(error);
        }
    });
}

async function copyWidget(destination: string) {
    return new Promise<boolean>((resolve, reject) => {
        const filename = settings.widget.name + ".mpk";
        const source = path.join(settings.folder.dist, settings.widget.version, filename);
        fs.access(destination, async error => {
            if (error) {
                fs.mkdirSync(destination);
            }
            try {
                await copyFile(source, path.join(destination, filename));
                resolve(true);
            } catch (copyError) {
                reject(copyError);
            }
        });
    });
}

async function copyFile(source, destination) {
    return new Promise<boolean>((resolve, reject) => {
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
}

const mkdirSync = (dirPath: string) => {
    try {
        fs.mkdirSync(dirPath);
    } catch (error) {
        if (error.code !== "EEXIST") throw error;
    }
};

async function zipFolder(source, destination) {
    return new Promise<boolean>((resolve, reject) => {
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
}
