import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import PetsApplicantDAO from "@models/dao/PetsApplicantDAO";
import { HTTPError } from "@models/HTTPError";
import applicants from "../resources/pets-applicant-test.json";

describe("PetsApplicantDAO", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe("putItem", () => {
    it("builds correct query and returns data on successful query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(PutCommand)
        .resolves("success" as unknown as PutCommandOutput);
      const expectedParams = applicants[0];
      const dao = new PetsApplicantDAO();
      const output = await dao.putItem(applicants[0]);
      const putStub = mockDynamoClient.commandCalls(PutCommand);
      expect(output).toEqual("success");
      expect(putStub[0].args[0].input.Item).toStrictEqual(expectedParams);
    });

    it("returns error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(PutCommand).rejects(myError);

      const dao = new PetsApplicantDAO();
      try {
        await dao.putItem(applicants[0]);
      } catch (err) {
        expect(err).toEqual(myError);
      }
    });
  });
});
