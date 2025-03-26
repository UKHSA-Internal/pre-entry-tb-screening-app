import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/http";
import { PetsRoute } from "../../shared/types";
import { createClinicHandler } from "../handlers/createClinic";
import { fetchActiveClinicsHandler } from "../handlers/fetchActiveClinics";
import { fetchClinicsHandler } from "../handlers/fetchClinics";
import { getClinicHandler } from "../handlers/getClinic";
import { checkActiveClinicHandler } from "../handlers/isActiveClinicHandler";
import { ClinicSchema } from "../types/zod-schema";
extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/clinics/{clinicId}",
    handler: createClinicHandler,
    requestBodySchema: ClinicSchema.openapi({ description: "Clinic details to be saved in DB" }),
    responseSchema: ClinicSchema.openapi({ description: "Saved Clinic Details" }),
  },
  {
    method: "GET",
    path: "/clinics/{clinicId}",
    handler: getClinicHandler,
    responseSchema: ClinicSchema.openapi({ description: "Clinic Details" }),
  },
  {
    method: "GET",
    path: "/clinics",
    handler: fetchClinicsHandler,
    responseSchema: z
      .array(ClinicSchema)
      .openapi("AllClinic", { description: "List of all registered clinics" }),
    queryParams: {
      country: z
        .string({ description: "When specified, returns only clinics in Country" })
        .optional(),
    },
  },
  {
    method: "GET",
    path: "/clinics/active",
    handler: fetchActiveClinicsHandler,
    responseSchema: z
      .array(ClinicSchema)
      .openapi("AllActiveClinics", { description: "List of all active clinics" }),
  },
  {
    method: "GET",
    path: "/clinics/active/{clinicId}",
    handler: checkActiveClinicHandler,
    responseSchema: ClinicSchema.openapi("IsClinicActive", {
      description: "True if the clinic is an active one",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
