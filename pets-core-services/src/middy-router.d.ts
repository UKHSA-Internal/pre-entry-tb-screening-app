import "@middy/http-router";

import { MiddyfiedHandler } from "@middy/core";
// eslint-disable-next-line no-duplicate-imports
import { Route } from "@middy/http-router";
import {
  ALBEvent,
  ALBResult,
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
} from "aws-lambda";

declare module "@middy/http-router" {
  type NotFoundResponse = ({
    method,
    path,
  }: {
    method: string;
    path: string;
  }) => APIGatewayProxyResult;

  export default function httpRouterHandler<
    TEvent extends ALBEvent | APIGatewayProxyEvent | APIGatewayProxyEventV2 = APIGatewayProxyEvent,
    TResult extends
      | ALBResult
      | APIGatewayProxyResult
      | APIGatewayProxyResultV2 = APIGatewayProxyResult,
  >({
    routes,
    notFoundResponse,
  }: {
    routes: Array<Route<TEvent, TResult>>;
    notFoundResponse?: NotFoundResponse;
  }): MiddyfiedHandler<TEvent, TResult>;
}
