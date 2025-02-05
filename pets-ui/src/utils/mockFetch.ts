// this mock function is for dev purposes, to change when API path is available
export const mockFetch = async (link: string, other?) => {
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
          applicantHomeAddress1: "10 Kuala Lumpur Lane",
          applicantHomeAddress2: "string",
          issueDate: "2024-02-04",
          countryOfIssue: "Laos",
          postcode: "Z12 7LK",
          townOrCity: "",
          sex: "Female",
          passportNumber: "007",
          fullName: "James Bond",
          country: "Laos",
          countryOfNationality: "Goa",
          expiryDate: "2028-02-04",
          dateOfBirth: "1980-02-04",
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
          travelInformation: {
            visaCategory: "string",
            ukAddressLine1: "string",
            ukAddressLine2: "string",
            ukAddressLine3: "string or null",
            ukAddressLine4: "string or null",
            ukAddressPostcode: "string",
            ukTelephoneNumber: "string",
            ukMobileNumber: "string or null",
            ukEmailAddress: "string",
          },
          medicalScreening: {
            age: "number or null",
            symptomsOfTb: "boolean or null",
            symptoms: "multiple options from valid symptoms",
            symptomsOther: "string or null",
            historyOfConditionsUnder11: "one of valid conditons",
            historyOfConditionsUnder11Details: "string or null",
            historyOfPreviousTb: "YesNoNone",
            previousTbDetails: "string or null",
            contactWithPersonWithTb: "YesNoNone",
            contactWithTbDetails: "YesNoNone",
            pregnant: "boolean or null",
            lastMenstralPeriod: "string or null",
            physicalExaminationConducted: "boolean or null",
            dateOfMedicalScreening: "string or null",
          },
          chestXrays: {
            cxrTaken: "boolean",
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
            sputumCollected: "boolean",
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
            dstConducted: "boolean",
            drugTested: "Multiple Options from List or null",
            drugResistance: "Yes or No or Not applicable",
            drugResistanceDetails: "string or null",
          },
          certification: {
            tbSuspected: "boolean or null",
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
      }

      return {
        status: 404,
      };
    }
  }
};
