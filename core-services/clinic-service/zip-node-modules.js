fs = require('fs')
fs.mkdir('./clinic-service-node-modules', (err) => {
    if (err) throw err;
})
inputPackageDotJson = fs.readFileSync('./core-services/clinic-service/package.json', 'utf-8')
outputPackageDotJson = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
fs.writeFile('./clinic-service-node-modules/package.json', outputPackageDotJson, (err) => {
    if (err) throw err;
});