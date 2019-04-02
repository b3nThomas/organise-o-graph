import * as colors from 'colors';
import { Organiser } from './src/Organiser';

(() => {
    const source = process.env.SRC || '';
    if (!source) {
        console.log(colors.bold.red('✖ Environment variable "SRC" must be defined. See README.md\n'));
        process.exit(1);
    }
    
    const tag = process.env.TAG || '';
    if (!tag) {
        console.log(colors.bold.red('✖ Environment variable "TAG" must be defined. See README.md\n'))
        process.exit(1);
    }
    
    const destination = process.env.DEST || process.env.SRC;
    
    new Organiser(source, destination, tag);
})();
