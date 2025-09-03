import { PetsAPIGatewayProxyEvent } from "../../shared/types";

// eslint-disable-next-line @typescript-eslint/require-await
export const createClinicHandler = async (event: PetsAPIGatewayProxyEvent) => {
  return { statusCode: 200, body: JSON.stringify(event) };
};
