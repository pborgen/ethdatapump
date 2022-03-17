

const PropertiesSingleton = require('../PropertiesSingleton');

class SSHHelper {

    constructor() { 
        this.properties = PropertiesSingleton;
    }

    executeCommandWithReturnValue(command) {
        const usernameAndHost = this.properties.getConnection().ssh_username_and_host;

        let sshCommand = 
            "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i /mnt/crypto/export/prod/id_rsa " + usernameAndHost + " " + command;

        console.log("About to execute command: " + sshCommand);

        const execSync = require('child_process').execSync;

        let returnValue = 
            execSync(
                sshCommand,
                { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
            );

        return returnValue;
    }
}

module.exports = SSHHelper;