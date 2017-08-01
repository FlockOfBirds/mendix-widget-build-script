import { EnvironmentMode } from "./services/DeploymentService";
export interface MinimalSettings {
    appName: string;
    key: string;
    user: string;
    password: string;
    projectId: string;
}
export interface Settings extends MinimalSettings {
    apiUrl: string;
    branchName: string;
    environment: EnvironmentMode;
    projectUrl: string;
    teamServerUrl: string;
    testProjectName: string;
    widget: {
        name: string;
        version: string;
    };
    folder: {
        build: string;
        dist: string;
        release: string;
    };
}
export declare const defaultSettings: PartialSettings;
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare type PartialSettings = Partial<Settings>;
export declare const getSettings: () => Settings;
