module.exports = (serviceName) => {
    // Create folder structure required for lambda layer
    const fs = require('fs')
    serviceName = serviceName.toString()
    fs.mkdirSync(`./node-zip/${serviceName}/nodejs/`, {recursive: true}, (err) => { if (err) throw err })

    // Create package.json containing only non-dev dependencies
    let inputPackageDotJson = fs.readFileSync(`./core-services/${serviceName}/package.json`, 'utf-8')
    let outputPackageDotJson = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
    fs.writeFileSync(`./node-zip/${serviceName}/nodejs/package.json`, outputPackageDotJson, (err) => {
        if (err) throw err;
    });
}