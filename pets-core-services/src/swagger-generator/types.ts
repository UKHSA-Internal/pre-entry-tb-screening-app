import { PetsRoute } from "../shared/types";

export type SwaggerConfig = {
  lambdaArn: string;
  routes: PetsRoute[];
};
