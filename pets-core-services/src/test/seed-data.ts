import { seededApplicants } from "../applicant-service/fixtures/applicants";
import { seededChestXray } from "../application-service/fixtures/chest-xray";
import { seededMedicalScreening } from "../application-service/fixtures/medical-screening";
import { seededTbCertificate } from "../application-service/fixtures/tb-certificate";
import { seededTravelInformation } from "../application-service/fixtures/travel-information";
import { ChestXRayDbOps } from "../application-service/models/chest-xray";
import { MedicalScreening } from "../application-service/models/medical-screening";
import { TbCertificateDbOps } from "../application-service/models/tb-certificate";
import { TravelInformation } from "../application-service/models/travel-information";
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
    await MedicalScreening.createMedicalScreening(medicalScreening);
  }
  for (const chestXray of seededChestXray) {
    await ChestXRayDbOps.createChestXray(chestXray);
  }
  for (const tbCertificate of seededTbCertificate) {
    await TbCertificateDbOps.createTbCertificate(tbCertificate);
  }
};

export default seedDatabase;

if (process.argv.includes("seed")) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  seedDatabase();
}
