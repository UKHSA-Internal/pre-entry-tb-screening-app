import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ClinicSchema = z
  .object({
    clinicId: z.string().openapi({
      description: "ID of the Clinic",
    }),
    name: z.string().openapi({
      description: "Name of the Clinic",
    }),
    country: z.string().openapi({
      description: "Country of the Clinic",
    }),
    city: z.string().openapi({
      description: "City of the Clinic",
    }),
    startDate: z.string().openapi({
      description: "Start Date of the Clinic",
    }),
    endDate: z.union([z.string(), z.null()]).optional().openapi({
      description: "End Date of the Clinic",
    }),
    createdBy: z.string().openapi({
      description: "Creator's email",
    }),
  })
  .openapi("Clinic", { description: "Details about a Clinic" });
