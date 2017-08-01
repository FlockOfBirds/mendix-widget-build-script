export declare class SvnService {
    private baseUrl;
    private username;
    private password;
    private destination;
    private branchUrl;
    constructor(baseUrl: string, username: string, password: string, destination: any);
    checkOutBranch(branch: string): Promise<boolean>;
    cleanup(): Promise<{}>;
    status(): Promise<{}>;
    commit(files: string, message: string): Promise<{}>;
    createBranch(sourceBranch: string, targetBranch: string, message: string): Promise<{}>;
    checkBranchExists(sourceBranch: any): void;
    private getBranchUrl(branch);
}
