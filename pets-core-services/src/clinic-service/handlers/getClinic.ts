import { APIGatewayProxyEvent } from "aws-lambda";

// eslint-disable-next-line @typescript-eslint/require-await
export const getClinicHandler = async (event: APIGatewayProxyEvent) => {
  // eslint-disable-next-line no-console
  console.log(event, "Invokation got here");

  return { statusCode: 200, body: "Hello World Clinic" };
};
