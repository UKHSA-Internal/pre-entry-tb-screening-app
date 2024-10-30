import { Configuration } from "@utils/Configuration";
import { IDBConfig, IFunctionConfig } from "@models/index";
import { ERRORS } from "@utils/Enum";

let dbConfig: IDBConfig;

function setUpDatabaseConfigs (env: string) {
  process.env.BRANCH = env;

  if (env == "develop") {
    dbConfig = getMockedConfig().getDynamoDBConfig();
  } else {
    dbConfig = Configuration.getInstance().getDynamoDBConfig();
  }
}

describe("Configuration", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const branch = process.env.BRANCH;
  afterAll(() => {
    process.env.BRANCH = branch;
  });

  describe("when calling getConfig", () => {
    it("returns the full config object", () => {
      const conf = Configuration.getInstance().getConfig();
      expect(Object.keys(conf)).toEqual(
        expect.arrayContaining(["functions", "dynamodb", "serverless"])
      );
      expect(Object.keys(conf.dynamodb)).toEqual(
        expect.arrayContaining(["local", "remote"])
      );
    });
  });

  describe("the config is empty", () => {
    const emptyConfig: Configuration = new Configuration(
      "../../test/resources/EmptyConfig.yml"
    );
    it("should throw error", () => {
      try {
        emptyConfig.getDynamoDBConfig();
      } catch (e) {
        expect((e as Error).message).toEqual(
          ERRORS.DYNAMODB_CONFIG_NOT_DEFINED
        );
      }
    });
  });

  describe("the BRANCH environment variable is local", () => {
    setUpDatabaseConfigs("local");
    it("should return the local invoke config", () => {
      expect(Object.keys(dbConfig.params)).toEqual(
        expect.arrayContaining(["region", "endpoint"])
      );
      expect(dbConfig.table).toEqual("pets-local-applicants");
    });
  });

  describe("the BRANCH environment variable is empty", () => {
    it("should return the remote invoke config", () => {
      setUpDatabaseConfigs("");
      expect(Object.keys(dbConfig)).not.toEqual(
        expect.arrayContaining(["keys"])
      );
      expect(dbConfig.table).toEqual("pets-applicant-details");
      expect(dbConfig.params).toStrictEqual({});
    });
  });

  describe("the BRANCH environment variable is 'develop'", () => {
    it("should return the remote invoke config", () => {
      setUpDatabaseConfigs("develop");
      expect(Object.keys(dbConfig)).not.toEqual(
        expect.arrayContaining(["keys"])
      );
      expect(dbConfig.table).toEqual("pets-applicant-details");
      expect(dbConfig.params).toStrictEqual({});
    });
  });

  describe("the config is present", () => {
    const funcConfig: IFunctionConfig[] =
      Configuration.getInstance().getFunctions();
    it("should return the list of specified functions with names and matching paths", () => {
      expect(funcConfig).toHaveLength(2);
      expect(funcConfig[0].name).toEqual("getPetsApplicant");
      expect(funcConfig[0].path).toEqual("/applicant-details");
      expect(funcConfig[1].name).toEqual("postPetsApplicant");
      expect(funcConfig[1].path).toEqual("/register-applicant");
    });
  });
});

/**
 * Configuration does the token replacement for ${BRANCH} on instantiation, so in order to
 * catch this early enough, need to use jest.resetModules() and a "require" import
 * of Configuration again
 */
const getMockedConfig: () => Configuration = () => {
  jest.resetModules();
  const ConfImp = require("../../src/utils/Configuration");
  return ConfImp.Configuration.getInstance();
};
