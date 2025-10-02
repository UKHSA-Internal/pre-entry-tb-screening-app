import { seededApplicants } from "../applicant-service/fixtures/applicants";
import { seededChestXray } from "../application-service/fixtures/chest-xray";
import { seededMedicalScreening } from "../application-service/fixtures/medical-screening";
import { seededRadiologicalOutcome } from "../application-service/fixtures/radiological-outcome";
import { seededSputumDecision } from "../application-service/fixtures/sputum-decision";
import { seededTbCertificate } from "../application-service/fixtures/tb-certificate";
import { seededTravelInformation } from "../application-service/fixtures/travel-information";
import { ChestXRay } from "../application-service/models/chest-xray";
import { MedicalScreeningDbOps } from "../application-service/models/medical-screening";
import { RadiologicalOutcome } from "../application-service/models/radiological-outcome";
import { SputumDecision } from "../application-service/models/sputum-decision";
import { TbCertificateDbOps } from "../application-service/models/tb-certificate";
import { TravelInformation } from "../application-service/models/travel-information";
import { seededClinics } from "../clinic-service/fixtures/clinics";
import { Clinic } from "../clinic-service/models/clinics";
import { seededApplications } from "../shared/fixtures/application";
import { Applicant } from "../shared/models/applicant";
import { Application } from "../shared/models/application";

export const seedDatabase = async () => {
  for (const app of seededApplications) {
    await Application.createNewApplication(app);
  }

  for (const applicantDetails of seededApplicants) {
    await Applicant.createNewApplicant(applicantDetails);
  }

  for (const travelInformation of seededTravelInformation) {
    await TravelInformation.createTravelInformation(travelInformation);
  }

  for (const medicalScreening of seededMedicalScreening) {
    await MedicalScreeningDbOps.createMedicalScreening(medicalScreening);
  }

  for (const chestXray of seededChestXray) {
    await ChestXRay.createChestXray(chestXray);
  }

  for (const radiologicalOutcome of seededRadiologicalOutcome) {
    await RadiologicalOutcome.createRadiologicalOutcome(radiologicalOutcome);
  }

  for (const sputumDecision of seededSputumDecision) {
    await SputumDecision.createSputumDecision(sputumDecision);
  }

  for (const tbCertificate of seededTbCertificate) {
    await TbCertificateDbOps.createTbCertificate(tbCertificate);
  }

  for (const clinic of seededClinics) {
    await Clinic.createNewClinic(clinic);
  }
};

export default seedDatabase;

if (process.argv.includes("seed")) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  seedDatabase();
}
