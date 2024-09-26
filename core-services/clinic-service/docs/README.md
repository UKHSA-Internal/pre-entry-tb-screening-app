# Service definition

Serverless is used to develop locally so that AWS Cloud capabilities can be mocked, however the main service documentation can be found below:

- **API specs**: please ref to the Open API specs for the service specifications in this directory. [tba]

- **API Requests**: You can also use the sample of postman requests provided in this directory too. [tba]

You will require the following environmental variables in your Postman (or similar third party) to be set-up that can be found in your API Gateway:

```sh
{{api}} # used for deployed APIs in your custom domain names, eg: develop, integration, etc..

{{branch}} # used to map your branch to APIG stages, eg: develop, cvsb-1234

{{bearer_token}} # required for the lambda authoriser to allow or deny lambda invocations based on roles and resources
```

> Lambda Authoriser is yet to be implemented
