import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicantPhoto } from "../models/applicant-photo";
import { ChestXRay } from "../models/chest-xray";
import { MedicalScreeningDbOps } from "../models/medical-screening";
import { RadiologicalOutcome } from "../models/radiological-outcome";
import { SputumDecision } from "../models/sputum-decision";
import { SputumDetailsDbOps } from "../models/sputum-details";
import { TbCertificateDbOps } from "../models/tb-certificate";
import { TravelInformationDbOps } from "../models/travel-information";

export const getApplicationHandler = async (event: PetsAPIGatewayProxyEvent) => {
  const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Retrieve Application handler triggered");

    const application = await Application.getByApplicationId(applicationId);
    if (!application) return createHttpResponse(404, { message: "Application does not exist" });

    const applicant = await ApplicantDbOps.findByPassportId(
      application.countryOfIssue,
      application.passportNumber,
    );
    if (!applicant) {
      logger.error("Application does not have an applicant");
      return createHttpResponse(400, { message: "Invalid Application - No Applicant" });
    }

    if (
      event.requestContext.authorizer.clinicId !== SUPPORT_CLINIC_ID &&
      application.clinicId != event.requestContext.authorizer.clinicId
    ) {
      logger.error("ClinicId mismatch");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }
    const clinicId = application.clinicId;
    const applicantPhotoUrl = await ApplicantPhoto.getByApplicationId(
      applicationId,
      clinicId,
      application.passportNumber,
      application.countryOfIssue,
    );
    const travelInformation = await TravelInformationDbOps.getByApplicationId(applicationId);
    const medicalScreening = await MedicalScreeningDbOps.getByApplicationId(applicationId);
    const chestXray = await ChestXRay.getByApplicationId(applicationId);
    const sputumDecision = await SputumDecision.getByApplicationId(applicationId);
    const sputumDetails = await SputumDetailsDbOps.getByApplicationId(applicationId);
    const tbCertificate = await TbCertificateDbOps.getByApplicationId(applicationId);
    const radiologicalOutcome = await RadiologicalOutcome.getByApplicationId(applicationId);

    return createHttpResponse(200, {
      applicationId,
      applicantPhotoUrl,
      clinicId,
      applicationStatus: application.applicationStatus,
      expiryDate: application.expiryDate ? application.expiryDate?.toISOString() : undefined,
      cancellationReason: application.cancellationReason,
      travelInformation: travelInformation?.toJson(),
      medicalScreening: medicalScreening?.toJson(),
      chestXray: chestXray?.toJson(),
      sputumRequirement: sputumDecision?.toJson(),
      sputumDetails: sputumDetails?.toJson(),
      tbCertificate: tbCertificate?.toJson(),
      radiologicalOutcome: radiologicalOutcome?.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error retrieving application details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
