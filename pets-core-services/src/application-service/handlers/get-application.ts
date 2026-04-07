import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
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
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Retrieve Application handler triggered");

    const application = await Application.getByApplicationId(applicationId);
    if (!application)
      return HttpErrors.notFound(`Application with ID: ${applicationId} does not exist`);

    const applicant = await ApplicantDbOps.findByPassportId(
      application.countryOfIssue,
      application.passportNumber,
    );
    if (!applicant) {
      logger.error("Application does not have an applicant");
      return HttpErrors.validationError("Invalid Application - No Applicant");
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

    return HttpResponses.ok({
      applicationId,
      applicantPhotoUrl,
      clinicId,
      applicationStatus: application.applicationStatus,
      dateCreated: application.dateCreated ? application.dateCreated.toISOString() : undefined,
      expiryDate: application.expiryDate ? application.expiryDate?.toISOString() : undefined,
      cancellationReason: application.cancellationReason,
      cancellationFurtherInfo: application.cancellationFurtherInfo,
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
    return HttpErrors.serverError("Something went wrong");
  }
};
