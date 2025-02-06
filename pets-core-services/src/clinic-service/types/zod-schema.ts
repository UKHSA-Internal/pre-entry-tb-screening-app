import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ClinicSchema = z
  .object({
    clinicId: z.string().openapi({
      description: "ID of the Clinic",
    }),
    clinicName: z.string().openapi({
      description: "Name of the Clinic",
    }),
    iom: z.boolean().openapi({
      description: "Is the Clinic an IOM clinic",
    }),
  })
  .openapi("Clinic", { description: "Details about a Clinic" });
