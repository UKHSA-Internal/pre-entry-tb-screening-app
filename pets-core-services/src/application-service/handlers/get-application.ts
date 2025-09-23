import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicantPhoto } from "../models/applicant-photo";
import { ChestXRayDbOps } from "../models/chest-xray";
import { MedicalScreening } from "../models/medical-screening";
import { RadiologicalOutcome } from "../models/radiological-outcome";
import { SputumDetailsDbOps } from "../models/sputum-details";
import { TbCertificateDbOps } from "../models/tb-certificate";
import { TravelInformation } from "../models/travel-information";

export const getApplicationHandler = async (event: PetsAPIGatewayProxyEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Retrieve Application handler triggered");

    const application = await Application.getByApplicationId(applicationId);
    if (!application) return createHttpResponse(404, { message: "Application does not exist" });

    if (application.clinicId != event.requestContext.authorizer.clinicId) {
      logger.error("ClinicId mismatch");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }
    const clinicId = application.clinicId;
    const applicantPhotoUrl = await ApplicantPhoto.getByApplicationId(applicationId, clinicId);
    const travelInformation = await TravelInformation.getByApplicationId(applicationId);
    const medicalScreening = await MedicalScreening.getByApplicationId(applicationId);
    const chestXray = await ChestXRayDbOps.getByApplicationId(applicationId);
    const sputumDetails = await SputumDetailsDbOps.getByApplicationId(applicationId);
    const tbCertificate = await TbCertificateDbOps.getByApplicationId(applicationId);
    const radiologicalOutcome = await RadiologicalOutcome.getByApplicationId(applicationId);

    return createHttpResponse(200, {
      applicationId,
      applicantPhotoUrl,
      travelInformation: travelInformation?.toJson(),
      medicalScreening: medicalScreening?.toJson(),
      chestXray: chestXray?.toJson(),
      sputumDetails: sputumDetails?.toJson(),
      tbCertificate: tbCertificate?.toJson(),
      radiologicalOutcome: radiologicalOutcome?.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error retrieving application details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
