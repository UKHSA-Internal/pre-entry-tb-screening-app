module.exports = (servicesToDeploy) => {
    const fullMatrix = [
        {
            "name": "applicant-service",
            "zip-file": "applicant-service-lambda.zip",
            "build-folder": ".build/*",
            "lambda": "applicant-service-lambda"
        },
        {
            "name": "clinic-service",
            "zip-file": "clinic-service-lambda.zip",
            "build-folder": ".build/*",
            "lambda": "clinic-service-lambda"
        },
        {
            "name": "lambda-authoriser",
            "zip-file": "lambda-authoriser.zip",
            "build-folder": "src/*",
            "lambda": "api-gateway-authoriser"
        }
    ]
    const deployMatrix = []
    for (service of fullMatrix) {
        if (servicesToDeploy.indexOf(service.name) > -1) {
            deployMatrix.push(service)
        }
    }
    return JSON.stringify({"service": {deployMatrix}})
}