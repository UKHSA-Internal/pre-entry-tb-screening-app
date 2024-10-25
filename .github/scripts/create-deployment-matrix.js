module.exports = (servicesToDeploy) => {
    console.log("servicesToDeploy:")
    console.log(servicesToDeploy)
    const matrix = [
        {
            "name": "applicant-service",
            "zip-file": "applicant-service-lambda.zip",
            "build-folder": ".build/*",
            "bucket-secret": process.env.CORESERVICESDEPLOY_APPLICANT_SERVICE_BUCKET_NAME,
            "sse-key-secret": process.env.CORESERVICESDEPLOY_APPLICANT_SERVICE_SSE_KEY,
            "lambda": "applicant-service-lambda"
        },
        {
            "name": "clinic-service",
            "zip-file": "clinic-service-lambda.zip",
            "build-folder": ".build/*",
            "bucket-secret": process.env.CORESERVICESDEPLOY_CLINIC_SERVICE_BUCKET_NAME,
            "sse-key-secret": process.env.CORESERVICESDEPLOY_CLINIC_SERVICE_SSE_KEY,
            "lambda": "clinic-service-lambda"
        },
        {
            "name": "lambda-authoriser",
            "zip-file": "lambda-authoriser.zip",
            "build-folder": "src/*",
            "bucket-secret": process.env.CORESERVICESDEPLOY_LAMBDA_AUTHORISER_BUCKET_NAME,
            "sse-key-secret": process.env.CORESERVICESDEPLOY_LAMBDA_AUTHORISER_SSE_KEY,
            "lambda": "api-gateway-authoriser"
        }
    ]
    for (service of matrix) {
        console.log("service: " + service)
        console.log("service name: " + service.name)
        console.log("service name index: " + servicesToDeploy.indexOf(service.name))
        if (servicesToDeploy.indexOf(service.name) < 0) {
            console.log("removing service")
            matrix.splice(0, matrix.indexOf(service))
        }
    }
    console.log("final matrix:")
    console.log(matrix)
    return {"matrix": matrix}
}