import { CountryCode } from "../../shared/country";
import { NewClinic } from "../models/clinics";

export const seededClinics: NewClinic[] = [
  {
    clinicId: "1",
    name: "Q-Life Family clinic",
    city: "Lagos",
    country: CountryCode.NGA,
    startDate: "2025-02-07",
    endDate: "2025-02-08",
    createdBy: "shane.park@iom.com",
  },
  {
    clinicId: "2",
    name: "Q-Life Family clinic",
    city: "Lagos",
    country: CountryCode.NGA,
    startDate: "2025-02-07",
    endDate: null,
    createdBy: "shawn.jones@clinic.com",
  },
  {
    clinicId: "3",
    name: "Q-Life Family clinic",
    city: "Lagos",
    country: CountryCode.NGA,
    startDate: "2025-02-07",
    endDate: "",
    createdBy: "john.doe@email.com",
  },
  {
    clinicId: "4",
    name: "Q-Life Family clinic",
    city: "Lagos",
    country: CountryCode.NGA,
    startDate: "2025-02-08",
    endDate: "225-01-10",
    createdBy: "sin.cos@encrypted.ai",
  },
  {
    clinicId: "5",
    name: "5tar Clinic",
    city: "Seoul",
    country: CountryCode.KOR,
    startDate: "2024-04-14",
    endDate: "3",
    createdBy: "john.doe@email.com",
  },
];
