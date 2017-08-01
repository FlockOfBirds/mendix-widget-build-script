export declare function getRequest<T>(opts: any): Promise<T>;
export declare function postRequest<T>(opts: any): Promise<T>;
export declare function deleteRequest<T>(opts: any): Promise<T>;
export declare function getFile(opts: any, filename: string): Promise<string>;
export declare function uploadFile<T>(opts: any, filename: string): Promise<T>;
