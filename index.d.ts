export declare class LogsObject {
    private apiKey;
    private url;
    private from;
    private level;
    private doLog;
    constructor(config: {
        url: string;
        apiKey: string;
        from: string | "api";
        level: number;
        doLog?: boolean;
    });
    log(content: string, args?: object): Promise<{
        success: true;
    } | {
        success: false;
        error: object;
    }>;
}
