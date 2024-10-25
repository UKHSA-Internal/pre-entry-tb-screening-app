module.exports = (servicesToDeploy) => {
    console.log("servicesToDeploy:")
    console.log(servicesToDeploy)
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
        console.log("service: " + service)
        console.log("service name: " + service.name)
        console.log("service name index: " + servicesToDeploy.indexOf(service.name))
        if (servicesToDeploy.indexOf(service.name) > -1) {
            console.log("adding service")
            deployMatrix.push(service)
        }
    }
    console.log("final matrix:")
    console.log(deployMatrix)
    return {"matrix": deployMatrix}
}