import { seededApplicants } from "../applicant-service/fixtures/applicants";
import { Applicant } from "../applicant-service/models/applicant";

export const seedDatabase = async () => {
  for (const applicantDetails of seededApplicants) {
    await Applicant.createNewApplicant(applicantDetails);
  }
};
export default seedDatabase;

if (process.argv.includes("seed")) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  seedDatabase();
}
