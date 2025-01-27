import { z } from "zod";

const errorSchema = z
  .object({
    code: z.string().optional().openapi({
      description: "A code for the specific error",
    }),
    message: z.string().optional().openapi({
      description: "A message describing the error",
    }),
  })
  .openapi("Error");

export const errorResponses = {
  "400": {
    description: "400 response",
    content: {
      "application/json": {
        schema: errorSchema,
      },
    },
  },
  "403": {
    description: "403 response",
    content: {
      "application/json": {
        schema: errorSchema,
      },
    },
  },
  "404": {
    description: "404 response",
    content: {
      "application/json": {
        schema: errorSchema,
      },
    },
  },
  "500": {
    description: "500 response",
    content: {
      "application/json": {
        schema: errorSchema,
      },
    },
  },
};
