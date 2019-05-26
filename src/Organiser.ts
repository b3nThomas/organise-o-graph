import * as colors from 'colors';
import { existsSync, readdirSync, statSync, copyFile, ensureDirSync } from 'fs-extra';
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
    private srcDir: string;
    private destDir: string;
    private files: IFile[] = [];

    constructor(srcDir: string, destDir: string, tag: string) {
        this.validFormats.combined = this.validFormats.photos.concat(this.validFormats.videos);
        this.setSourceDirectory(srcDir);
        this.setDestinationDirectory(destDir);
        this.storeFileMetadata();
        this.sortFilesByAge();
        this.copyFilesToDestination(tag);
    }

    private setSourceDirectory(srcDir: string): void {
        srcDir = resolvePath(srcDir); 
        if (!existsSync(srcDir)) {
            console.log(
                colors.bold.red(`✖ Source folder "${srcDir}" does not exist. Exiting`)
            );
            process.exit(1)
        }
        this.srcDir = srcDir;
        console.log(
            colors.bold.green('✔'),
            colors.bold('Source confirmed:'),
            colors.bold.green(srcDir)
        );
    }
    
    private setDestinationDirectory(destDir: string): void {
        if (!existsSync(destDir)) {
            console.log(
                colors.bold.yellow('⚠'),
                colors.bold('Destination folder not found:'),
                colors.bold.yellow(destDir),
            );
            console.log(
                colors.bold.yellow('⚠'),
                colors.bold('Creating...')
            );
            ensureDirSync(destDir);
        }
        this.destDir = destDir;
        console.log(
            colors.bold.green('✔'),
            colors.bold('Destination confirmed:'), 
            colors.green.bold(destDir)
        );
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
        console.log(
            colors.bold.cyan('ℹ'),
            colors.bold('Photos:'),
            colors.bold.cyan(`${photos}`)
        );
        
        const videos = this.files.filter(file => file.type === 'video').length;
        console.log(
            colors.bold.cyan('ℹ'),
            colors.bold('Videos:'), 
            colors.bold.cyan(`${videos}`)
        );
    }

    private sortFilesByAge(): void {
        this.files.sort((a, b) => a.createdDate - b.createdDate);
    }

    private copyFilesToDestination(tag): void {
        const leadingZeroes = this.files.length.toString().length;
        tag = tag.trim().replace(' ', '_');
        
        console.log(
            colors.bold.yellow('⚠'),
            colors.bold('Copying files...')
        );

        this.files.forEach((file, i) => {
            let index = `${i + 1}`;
            const name = file.fileName;
            const format = `.${name.split('.').pop().toLowerCase()}`;
            const num = (function() {
                for (let n = index.length; n < leadingZeroes; n++) {
                    index = `0${index}`;
                }
                return index;
            })();
            
            const destName = `${tag}_${index}${format}`;
            const dest = `${this.destDir}/${destName}`;

            copyFile(`${this.srcDir}/${name}`, dest, err => {
                if (err) {
                    console.log(
                        colors.bold.red('✖'),
                        colors.bold(`Error copying "${name}" to "${destName}"`)
                    );
                    console.log(colors.bold.red(`✖ ${ err.message }`));
                }
                console.log(
                    colors.bold.green('✔'),
                    colors.bold.magenta(name),
                    colors.bold.yellow('→'),
                    colors.bold.cyan(`${tag}_${num}${format}`)
                );
            });
        });
    }

    private getValidFileNames(): string[] {
        let files = readdirSync(this.srcDir).filter(file => {
            return this.validFormats.combined.includes(file.split('.').pop().toLowerCase());
        });
        return files;
    }

    private getCreatedDateInMs(fileName: string): number {
        return statSync(resolvePath(this.srcDir, fileName)).birthtimeMs;
    }

    private getFileType(fileName: string): IFileType {
        const format = fileName.split('.').pop().toLowerCase();
        return this.validFormats.photos.includes(format) ? 'photo' : 'video';
    };
}
