module.exports = (serviceName) => {
    // Create folder structure required for lambda layer
    const fs = require('fs')
    serviceName = serviceName.toString()
    fs.mkdir(`./node-zip/${serviceName}/nodejs`, { recursive: true }, (err) => {
        if (err) throw err;
    })

    fs.readdir(`./`, (err, files) => { if (err) throw err; else console.log(files)})
    fs.readdir(`./node-zip/`, (err, files) => { if (err) throw err; else console.log(files)})
    fs.readdir(`./node-zip/${serviceName}/`, (err, files) => { if (err) throw err; else console.log(files)})
    fs.readdir(`./node-zip/${serviceName}/nodejs/`, (err, files) => { if (err) throw err; else console.log(files)})

    // Create package.json containing only non-dev dependencies
    let inputPackageDotJson = fs.readFileSync(`./core-services/${serviceName}/package.json`, 'utf-8')
    let outputPackageDotJson = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
    fs.writeFile(`./node-zip/${serviceName}/nodejs/package.json`, outputPackageDotJson, (err) => {
        if (err) throw err;
    });
}