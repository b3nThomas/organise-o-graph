import * as colors from 'colors';
import * as fs from 'fs-meta';

export class FileHelper {
    private srcDir: string;
    constructor(srcDir: string) {
        this.srcDir = srcDir;
    }
    public getValidFileNames(): string[] {
        return [];
    }
}
