import { Configuration } from "@utils/Configuration";
import { IDBConfig, IFunctionConfig } from "@models/index";
import { ERRORS } from "@utils/Enum";

let dbConfig: IDBConfig;

function setUpConfigs (env: string) {
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
        expect.arrayContaining(["local", "local-global", "remote"])
      );
    });
  });

  describe("the config is empty", () => {
    setUpConfigs("local");
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
    setUpConfigs("local");
    it("should return the local invoke config", () => {
      expect(Object.keys(dbConfig.params)).toEqual(
        expect.arrayContaining(["region", "endpoint"])
      );
      expect(dbConfig.table).toEqual("pets-local-clinics");
    });
  });

  describe("the BRANCH environment variable is local-global", () => {
    process.env.BRANCH = "local-global";
    const databaseConfig:IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    it("should return the local-global invoke config", () => {
      expect(Object.keys(databaseConfig)).toEqual(
        expect.arrayContaining(["params", "table"])
      );
      expect(Object.keys(databaseConfig.params)).toEqual(
        expect.arrayContaining(["region", "endpoint"])
      );
      expect(Object.keys(databaseConfig)).not.toEqual(
        expect.arrayContaining(["keys"])
      );
      expect(databaseConfig.table).toEqual("pets-local-global-clinics");
    });
  });

  describe("the BRANCH environment variable is empty", () => {
    process.env.BRANCH = "";
    let dbConfig = Configuration.getInstance().getDynamoDBConfig();
    it("should return the remote invoke config", () => {
      expect(Object.keys(dbConfig)).not.toEqual(
        expect.arrayContaining(["keys"])
      );
      expect(dbConfig.table).toEqual("pets-clinics");
      expect(dbConfig.params).toStrictEqual({});
    });
  });

  describe("the config is empty", () => {
    setUpConfigs("local");
    const emptyConfig: Configuration = new Configuration(
      "../../test/resources/EmptyConfig.yml"
    );
    it("should throw error", () => {
      try {
        emptyConfig.getFunctions();
      } catch (e) {
        expect((e as Error).message).toEqual(
          ERRORS.FUNCTION_CONFIG_NOT_DEFINED
        );
      }
    });

    describe("the BRANCH environment variable is 'develop'", () => {
      it("should return the remote invoke config", () => {
        setUpConfigs("develop");
        expect(Object.keys(dbConfig)).not.toEqual(
          expect.arrayContaining(["keys"])
        );
        expect(dbConfig.table).toEqual("pets-clinics");
        expect(dbConfig.params).toStrictEqual({});
      });
    });
  });

  describe("the config is present", () => {
    setUpConfigs("local");
    const funcConfig: IFunctionConfig[] =
      Configuration.getInstance().getFunctions();
    it("should return the list of specified functions with names and matching paths", () => {
      expect(funcConfig).toHaveLength(2);
      expect(funcConfig[0].name).toEqual("getPetsClinics");
      expect(funcConfig[0].path).toEqual("/clinics");
      expect(funcConfig[1].name).toEqual("getPetsClinic");
      expect(funcConfig[1].path).toEqual(
        "/clinics/:petsClinicId"
      );
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
