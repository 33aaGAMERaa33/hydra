import chalk from 'chalk';

export class LogService {
    private static readonly logIsActive: boolean = true;
    private static readonly debugMode: boolean = true;
    
    private constructor() {

    }

    static log(log: Object, onlyInDebug = false) {
        if(!this.logIsActive || (!this.debugMode && onlyInDebug)) return;

        console.log(`${chalk.blueBright("[LOG]")} ${log}`);
    }
    
    static alert(log: Object, onlyInDebug = false) {
        if(!this.logIsActive || (!this.debugMode && onlyInDebug)) return;
    
        console.log(`${chalk.yellowBright("[ALERT]")} ${log}`);
    }
    
    static error(log: Object, onlyInDebug = false) {
        if(!this.logIsActive || (!this.debugMode && onlyInDebug)) return;
    
        console.log(`${chalk.redBright("[ERROR]")} ${log}`);
    }
}