import * as colors from 'colors';
import { existsSync, readdirSync, statSync } from 'fs-extra';
import { get as getConfig } from 'config';
import { resolve as resolvePath } from 'path';

interface IValidFormats {
    photos: string[];
    videos: string[];
    combined: string[];
}

interface IFile {
    fileName: string;
    createdDate: number;
    type: IFileType;
}

type IFileType = 'photo' | 'video';

export class Organiser {
    private validFormats: IValidFormats = getConfig<IValidFormats>('validFileTypes');
    public srcDir: string;
    public destDir: string;
    public files: IFile[] = [];

    constructor(srcDir: string, destDir: string, _tag: string) {
        this.setSourceDirectory(srcDir);
        this.setDestinationDirectory(destDir);
        this.storeFileMetadata();
        this.sortFilesByAge();
    }

    private setSourceDirectory(srcDir: string): void {
        srcDir = resolvePath(srcDir); 
        if (!existsSync(srcDir)) {
            console.log(colors.bold.red(`Source folder "${srcDir}" does not exist. Exiting`));
            process.exit(1)
        }
        this.srcDir = srcDir;
        console.log(colors.bold('[+] Source folder:'), colors.green.bold(srcDir));
    }
    
    private setDestinationDirectory(destDir: string): void {
        if (!existsSync(destDir)) {
            console.log(colors.bold.red(`Destination folder "${destDir}" does not exist. Exiting`));
            process.exit(1)
        }
        this.destDir = destDir;
        console.log(colors.bold('[+] Destination folder:'), colors.green.bold(destDir));
    }

    private storeFileMetadata(): void {
        this.getValidFileNames().forEach(fileName => {
            this.files.push({
                fileName,
                createdDate: this.getCreatedDateInMs(fileName),
                type: this.getFileType(fileName)
            });
        });

        const photos = this.files.filter(file => file.type === 'photo').length;
        console.log(colors.bold('[+] Photos:'), colors.yellow.bold(`${photos}`));
        
        const videos = this.files.filter(file => file.type === 'video').length;
        console.log(colors.bold('[+] Videos:'), colors.yellow.bold(`${videos}`));
    }

    private sortFilesByAge(): void {
        console.log(JSON.stringify(this.files.slice(0, 10), null, 4));
        this.files.sort((a, b) => a.createdDate - b.createdDate);
        console.log(JSON.stringify(this.files.slice(0, 10), null, 4));
    }

    public getValidFileNames(): string[] {
        let files = readdirSync(this.srcDir).filter(file => {
            return this.validFormats.combined.includes(file.split('.').pop().toLowerCase());
        });
        return files;
    }

    public getCreatedDateInMs(fileName: string): number {
        return statSync(resolvePath(this.srcDir, fileName)).birthtimeMs;
    }

    private getFileType(fileName: string): IFileType {
        const format = fileName.split('.').pop().toLowerCase();
        return this.validFormats.photos.includes(format) ? 'photo' : 'video';
    };
}
