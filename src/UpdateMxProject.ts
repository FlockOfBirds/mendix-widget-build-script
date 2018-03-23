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

updateProject().then(() => process.exit(0), () => process.exit(1));

async function updateProject() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            await svn.checkOutBranch(settings.projectId, settings.branchName);
            await copyWidget(path.join(settings.folder.build, "widgets"));
            mkdirSync(settings.folder.release);
            await copyWidget(settings.folder.release);
            await zipFolder(settings.folder.build, path.resolve(settings.folder.release, settings.testProjectName));
            const changedFiles = settings.widget.names.map(n => path.join(settings.folder.build, "widgets", n + ".mpk"));
            await svn.commit(changedFiles, "CI script commit");

            console.log("Done");
            resolve();
        } catch (error) {
            console.error("Error updating Mendix project", error);
            reject(error);
        }
    });
}

async function copyWidget(destination: string) {
    console.log(`Copy widget to ${destination}`);
    return new Promise<void>((resolve, reject) => {
        fs.access(destination, async error => {
            if (error) {
                fs.mkdirSync(destination);
            }
            try {
                settings.widget.names.forEach(async name => {
                    const filename = name + ".mpk";
                    const source = path.join(settings.folder.dist, settings.widget.version, filename);
                    await copyFile(source, path.join(destination, filename));
                });
                resolve();
            } catch (copyError) {
                reject(copyError);
            }
        });
    });
}

async function copyFile(source: string, destination: string) {
    return new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(source);
        readStream.once("error", (error: Error) => {
            reject(error);
        });
        readStream.once("end", () => {
            resolve();
        });
        readStream.pipe(fs.createWriteStream(destination));
    });
}

const mkdirSync = (dirPath: string) => {
    console.log(`Create folder ${dirPath}`);
    try {
        fs.mkdirSync(dirPath);
    } catch (error) {
        if (error.code !== "EEXIST") throw error;
    }
};

async function zipFolder(source: string, destination: string) {
    console.log(`Zip folder ${source} to ${destination}`);
    return new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(destination);
        const archive = archiver("zip");

        output.on("close", () => {
            resolve();
        });

        archive.on("error", error => {
            reject(error);
        });

        archive.pipe(output);
        archive.directory(source, "/");
        archive.finalize();
    });
}
