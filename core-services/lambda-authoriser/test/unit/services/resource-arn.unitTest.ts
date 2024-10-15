import { arnToString, ResourceArn, stringToArn } from "../../../src/services/resource-arn";

const arn: ResourceArn = {
  region: "eu-west-2",
  accountId: "1234",
  apiId: "cafe-babe",
  stage: "develop",
  httpVerb: "GET",
  resource: "myResource",
  childResource: "my/child/resource",
};

const arnPartial = "execute-api:eu-west-2:1234:cafe-babe/develop/GET/myResource/my/child/resource";

describe("arnToString()", () => {
  it("should return correct string representation of Arn", () => {
    expect(arnToString(arn)).toEqual(`arn:aws:${arnPartial}`);
  });
});

describe("stringToArn()", () => {
  it("should return correct Arn representation of string", () => {
    expect(stringToArn(`arn:aws:${arnPartial}`)).toEqual(arn);
  });
});

describe("throw errors", () => {
  it("should throw an error when Arn is null, blank, or invalid", () => {
    expect(() => { stringToArn("") }).toThrowError(Error);
    expect(() => { stringToArn("") }).toThrow("ARN is null or blank");

    let test_arn = `arnaws:${arnPartial}`;
    expect(() => { stringToArn(test_arn) }).toThrowError(Error);
    expect(() => { stringToArn(test_arn) }).toThrow("ARN does not consist of six colon-delimited parts");

    test_arn = `test:aws:${arnPartial}`;
    expect(() => { stringToArn(test_arn) }).toThrowError(Error);
    expect(() => { stringToArn(test_arn) }).toThrow("ARN part 0 should be exact string 'arn'");

    test_arn = `arn:test:${arnPartial}`;
    expect(() => { stringToArn(test_arn) }).toThrowError(Error);
    expect(() => { stringToArn(test_arn) }).toThrow("ARN part 1 should be exact string `aws`");

    test_arn = `arn:aws:test:${arnPartial}`;
    expect(() => { stringToArn(test_arn) }).toThrowError(Error);
    expect(() => { stringToArn(test_arn) }).toThrow("ARN part 2 is not `execute-api` - this is not an API Gateway ARN");

    test_arn = `arn:aws:${arnPartial}`;
    expect(() => { stringToArn(test_arn) }).toThrowError(Error);
    expect(() => { stringToArn(test_arn) }).toThrow("ARN path should consist of at least three parts: /{apiId}/{stage}/{httpVerb}/");
  });
});
