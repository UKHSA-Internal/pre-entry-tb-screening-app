/* eslint-disable @typescript-eslint/require-await */

// this mock function is for dev purposes, to change when API path is available
// will be deleted when API is available

interface MockResponseType {
  status: number;
  header?: { [key: string]: any };
  medicalScreening?: MedicalScreeningType;
  travelInformation?: TravelDetailsType;
  chestXrays?: ChestXrayDetailsType;
  sputumCollection?: SputumCollectionDetailsType;
  certification?: CertificationDetailsType;
  applicantHomeAddress1?: string;
  applicantHomeAddress2?: string;
  countryOfIssue?: string;
  postcode?: string;
  townOrCity?: string;
  sex?: string;
  passportNumber?: string;
  fullName?: string;
  country?: string;
  countryOfNationality?: string;
  dateOfBirth?: DateType;
}

export const mockFetch = async (
  link: string,
  header: { [key: string]: any },
): Promise<MockResponseType> => {
  const baseUrl = "http://localhost:3000/api/";
  if (link.startsWith(baseUrl)) {
    const path = link.slice(baseUrl.length);

    const queryParams: Record<string, string> = {};
    const queryString = path.split("?")[1];
    if (queryString) {
      const pairs = queryString.split("&");
      pairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        queryParams[key] = value;
      });
    }

    // applicant
    if (path.startsWith(`applicant`)) {
      if (queryParams.passportNumber === "007" || queryParams.passportNumber === "008") {
        return {
          status: 200,
          header: header,
          applicantHomeAddress1: "10 Kuala Lumpur Lane",
          applicantHomeAddress2: "string",
          countryOfIssue: "Laos",
          postcode: "Z12 7LK",
          townOrCity: "",
          sex: "Female",
          passportNumber: "007",
          fullName: "James Bond",
          country: "Laos",
          countryOfNationality: "Goa",
          dateOfBirth: {
            year: "1980",
            month: "02",
            day: "04",
          },
        };
      } else if (queryParams.passportNumber === `SPECIALTriggerErrorApplicant`) {
        return {
          status: 500,
        };
      }

      return {
        status: 404,
      };

      // application
    } else if (path.startsWith(`application`)) {
      if (queryParams.passportNumber === "007") {
        return {
          status: 200,
          header: header,
          travelInformation: {
            visaType: "string",
            applicantUkAddress1: "string",
            applicantUkAddress2: "string",
            applicantUkAddress3: "string or null",
            applicantUkAddress4: "string or null",
            townOrCity: "string or null",
            postcode: "string",
            ukMobileNumber: "string or null",
            ukEmail: "string",
          },
          medicalScreening: {
            age: "30",
            tbSymptoms: "string",
            tbSymptomsList: ["string"],
            otherSymptomsDetail: "string",
            underElevenConditions: ["string"],
            underElevenConditionsDetail: "string",
            previousTb: "string",
            previousTbDetail: "string",
            closeContactWithTb: "string",
            closeContactWithTbDetail: "string",
            pregnant: "string",
            menstrualPeriods: "string",
            physicalExamNotes: "string",
          },
          chestXrays: {
            cxrTaken: true,
            posteriorAnterior: "bucket-path or null if cxrTaken is No",
            apicalLordotic: "bucket-path or null",
            lateralDecubitus: "bucket-path or null",
            reasonWhyCxrWasNotDone2: "multiple options from reason or null if cxrTaken is Yes",
            reasonWhyCxrWasNotDone3: "string or null",
            dateOfCxr: "string or null",
            radiologicalOutcome: "one of valid outcome",
            radiologicalOutcomeNotes: "string or null",
            radiologicalFinding: "string or null",
            dateOfRadiologicalInterpretation: "string or null",
            sputumCollected: true,
            reasonWhySputumNotRequired: "string or null",
          },
          sputumCollection: {
            dateOfSputumSample1: "string or null",
            collectionMethodSample1: "string or null",
            collectionMethodOtherSample1: "string or null",
            smearResult1: "string or null",
            cultureResult1: "string or null",
            dateOfSputumSample2: "string or null",
            collectionMethodSample2: "string or null",
            collectionMethodOtherSample2: "string or null",
            smearResult2: "string or null",
            cultureResult2: "string or null",
            dateOfSputumSample3: "string or null",
            collectionMethodSample3: "string or null",
            collectionMethodOtherSample3: "string or null",
            smearResult3: "string or null",
            cultureResult3: "string or null",
            dstConducted: false,
            drugTested: "Multiple Options from List or null",
            drugResistance: "No",
            drugResistanceDetails: "string or null",
          },
          certification: {
            tbSuspected: false,
            tbSuspectedBasedOn: "string or null",
            clearanceCertificateIssued: "string or null",
            reasonForNonIssue: "string or null",
            reasonForNonIssue2: "string or null",
            physiciansComments: "string or null",
            issueDateofMedicalCertificate: "string or null",
            clearanceCertificateNumber: "string or null",
            ApplicationStatus: "ApplicationStatus",
          },
        };
      } else if (queryParams.passportNumber === `SPECIALTriggerErrorApplication`) {
        return {
          status: 500,
        };
      }

      return {
        status: 404,
      };
    }
  }

  return {
    status: 500,
  };
};
