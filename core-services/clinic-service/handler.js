const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const CLINICS_TABLE = "pets-local-clinics";
const client = new DynamoDBClient({ region: "localhost", endpoint: "http://127.0.0.1:8007"});
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/clinics/:petsClinicId", async (req, res) => {
  console.log(`${req.params.petsClinicId} ----- pets clinic id requested!!!`)
  const params = {
    TableName: CLINICS_TABLE,
    Key: {
      petsClinicId: `${req.params.petsClinicId}`,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    console.log(`${Item} --- response from db`);
    if (Item) {
      const { petsClinicId, name } = Item;
      res.json({ petsClinicId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find clinic with provided "petsClinicId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve clinic" });
  }
});

app.get("/clinics", async (req, res) => {
  const params = {
    TableName: CLINICS_TABLE
  };

  try {
    const command = new ScanCommand(params);
    const { Items } = await docClient.send(command);
    res.json(Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve all clinics" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
