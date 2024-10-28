import { Handler } from "aws-lambda";

interface IDBConfig {
  params: { region: string; endpoint: string; convertEmptyValues: boolean };
  table: string;
}

interface IFunctionConfig {
  name: string;
  path: string;
  function: Handler;
  method: string;
}

export { IDBConfig, IFunctionConfig };
