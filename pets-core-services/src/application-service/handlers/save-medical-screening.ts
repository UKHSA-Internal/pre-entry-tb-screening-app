import { APIGatewayProxyEvent } from "aws-lambda";

// eslint-disable-next-line @typescript-eslint/require-await
export const saveMedicalScreening = async (event: APIGatewayProxyEvent) => {
  return { statusCode: 200, body: JSON.stringify(event) };
};
