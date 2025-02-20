import { seededApplications } from "../../shared/fixtures/application";
import { ITravelInformation } from "../models/travel-information";
import { VisaOptions } from "../types/enums";

export const seededTravelInformation: Omit<ITravelInformation, "dateCreated" | "status">[] = [
  {
    applicationId: seededApplications[1].applicationId,
    visaCategory: VisaOptions.Students,
    ukAddressLine1: "182 Willow Crescent",
    ukAddressLine2: "Birmingham",
    ukAddressPostcode: "B12 8QP",
    ukMobileNumber: "07001234567",
    ukEmailAddress: "JaneDoe@email.com",
    createdBy: "shane.park@iom.com",
  },
  {
    applicationId: seededApplications[2].applicationId,
    visaCategory: VisaOptions.Work,
    ukAddressLine1: "29 Maple Street",
    ukAddressLine2: "London",
    ukAddressPostcode: "NW3 4JT",
    ukMobileNumber: "075000012345",
    ukEmailAddress: "JohnPark@email.com",
    createdBy: "shawn.jones@clinic.com",
  },
];
