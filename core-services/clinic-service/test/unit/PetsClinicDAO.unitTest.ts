import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput
} from "@aws-sdk/lib-dynamodb";
// import { context } from "jest-plugin-context";
import { mockClient } from "aws-sdk-client-mock";
import PetsClinicDAO from "../../src/models/dao/PetsClinicDAO";
import { HTTPError } from "../../src/models/HTTPError";
import { RESPONSE_STATUS } from "../../src/utils/Enum";
import clinics from "../resources/pets-clinics.json";
import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";

describe("PetsClinicDAO", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe("getAll", () => {
    it("returns data on successful query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(ScanCommand)
        .resolves("success" as unknown as ScanCommandOutput);
      const dao = new PetsClinicDAO();
      const output = await dao.getAll();
      expect(output).toEqual(RESPONSE_STATUS.SUCCESS);
    });

    it("throw error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(ScanCommand).rejects(myError);
      const dao = new PetsClinicDAO();
      try {
        await dao.getAll();
      } catch (e) {
        expect(e).toEqual(myError);
      }
    });
  });

  describe("putItem", () => {
    it("builds correct query and returns data on successful query", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient
        .on(PutCommand)
        .resolves("success" as unknown as PutCommandOutput);
      const expectedParams = clinics[0];
      const dao = new PetsClinicDAO();
      const output = await dao.putItem(clinics[0]);
      const putStub = mockDynamoClient.commandCalls(PutCommand);
      expect(output).toEqual("success");
      expect(putStub[0].args[0].input.Item).toStrictEqual(expectedParams);
    });

    it("returns error on failed query", async () => {
      const myError = new HTTPError(418, "It broke");
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(PutCommand).rejects(myError);

      const dao = new PetsClinicDAO();
      try {
        await dao.putItem(clinics[0]);
      } catch (err) {
        expect(err).toEqual(myError);
      }
    });
  });
});
