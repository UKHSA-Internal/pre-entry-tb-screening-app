module.exports = (serviceName) => {
    // Create folder structure required for lambda layer
    console.log(serviceName)
    console.log(typeof(serviceName))
    const fs = require('fs')
    serviceName = serviceName.toString()
    console.log(serviceName)
    console.log(typeof(serviceName))
    fs.mkdirSync(`./node-zip/${serviceName}/nodejs/`, {recursive: true}, (err) => { if (err) throw err })
    console.log('mkdir successful')

    // Create package.json containing only non-dev dependencies
    let inputPackageDotJson = fs.readFileSync(`./core-services/${serviceName}/package.json`, 'utf-8')
    console.log('input package successful')
    let outputPackageDotJson = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
    console.log('output package successful')
    fs.writeFileSync(`./node-zip/${serviceName}/nodejs/package.json`, outputPackageDotJson, (err) => {
        if (err) throw err;
    });
    console.log('write file successful')
}