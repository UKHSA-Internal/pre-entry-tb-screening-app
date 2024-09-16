fs = require('fs')
fs.mkdir('./nodejs', (err) => {
    if (err) throw err;
})
let inputPackageDotJson = fs.readFileSync('./core-services/clinic-service/package.json', 'utf-8')
let outputPackageDotJson = '{"dependencies":' + JSON.stringify(JSON.parse(inputPackageDotJson)['dependencies']) + '}'
fs.writeFile('./nodejs/package.json', outputPackageDotJson, (err) => {
    if (err) throw err;
});
