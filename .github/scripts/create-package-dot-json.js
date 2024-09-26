module.exports = (serviceName) => {
    // Create folder structure required for lambda layer
    const fs = require('fs')
    serviceName = serviceName.toString()
    fs.mkdir(`./node-zip/${serviceName}/nodejs`, { recursive: true }, (err) => {
        if (err) throw err;
    })

    console.log(fs.readdir(`./`))
    console.log(fs.readdir(`./node-zip/`))
    console.log(fs.readdir(`./node-zip/${serviceName}/`))
    console.log(fs.readdir(`./node-zip/${serviceName}/nodejs/`))

    // Create package.json containing only non-dev dependencies
    let inputPackageDotJson = fs.readFileSync(`./core-services/${serviceName}/package.json`, 'utf-8')
    let outputPackageDotJson = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
    fs.writeFile(`./node-zip/${serviceName}/nodejs/package.json`, outputPackageDotJson, (err) => {
        if (err) throw err;
    });
}