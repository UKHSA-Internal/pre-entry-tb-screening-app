module.exports = (serviceName: string) => {
    // Create folder structure required for lambda layer
    const fs = require('fs')
    fs.mkdirSync(`./node-zip/${serviceName}/nodejs/`, {recursive: true}, (err) => { if (err) throw err })

    // Create package.json containing only non-dev dependencies
    let inputPackageDotJson: string = fs.readFileSync(`./core-services/${serviceName}/package.json`, 'utf-8')
    let outputPackageDotJson: string = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
    fs.writeFileSync(`./node-zip/${serviceName}/nodejs/package.json`, outputPackageDotJson, (err) => {
        if (err) throw err;
    });
}