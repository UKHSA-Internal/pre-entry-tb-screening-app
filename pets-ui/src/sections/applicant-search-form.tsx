import axios from "axios";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  ApplicantDetailsType,
  ApplicantReturnedDetailsType,
  DateType,
  MedicalReturnedScreeningType,
  MedicalScreeningType,
  TravelDetailsType,
  TravelReturnedDetailsType,
} from "@/applicant";
import Button from "@/components/button/button";
import Dropdown from "@/components/dropdown/dropdown";
import FreeText from "@/components/freeText/freeText";
import {
  clearApplicantDetails,
  setApplicantDetails,
  setApplicantDetailsStatus,
  setCountryOfIssue,
  setPassportNumber,
} from "@/redux/applicantSlice";
import { clearApplicationDetails } from "@/redux/applicationSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  clearMedicalScreeningDetails,
  setMedicalScreeningDetails,
  setMedicalScreeningStatus,
} from "@/redux/medicalScreeningSlice";
import { clearTravelDetails, setTravelDetails, setTravelDetailsStatus } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { countryList, formRegex } from "@/utils/helpers";

type ApplicantSearchFormType = {
  passportNumber: string;
  countryOfIssue: string;
};

const ApplicantSearchForm = () => {
  const navigate = useNavigate();
  const methods = useForm<ApplicantSearchFormType>({ reValidateMode: "onSubmit" });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearApplicationDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const updateReduxPassportDetails = (applicantSearchData: ApplicantSearchFormType) => {
    dispatch(setPassportNumber(applicantSearchData.passportNumber));
    dispatch(setCountryOfIssue(applicantSearchData.countryOfIssue));
  };

  const updateReduxApplicantDetails = (applicantData: ApplicantReturnedDetailsType) => {
    const dateOfBirthObj: DateType = {
      year: applicantData.dateOfBirth.split("-")[0],
      month: applicantData.dateOfBirth.split("-")[1],
      day: applicantData.dateOfBirth.split("-")[2],
    };
    const expiryDateObj: DateType = {
      year: applicantData.expiryDate.split("-")[0],
      month: applicantData.expiryDate.split("-")[1],
      day: applicantData.expiryDate.split("-")[2],
    };
    const issueDateObj: DateType = {
      year: applicantData.issueDate.split("-")[0],
      month: applicantData.issueDate.split("-")[1],
      day: applicantData.issueDate.split("-")[2],
    };
    const reduxApplicantData: ApplicantDetailsType = {
      status: ApplicationStatus.INCOMPLETE,
      fullName: applicantData.fullName,
      sex: applicantData.sex,
      dateOfBirth: dateOfBirthObj,
      countryOfNationality: applicantData.countryOfNationality,
      passportNumber: applicantData.passportNumber,
      countryOfIssue: applicantData.countryOfIssue,
      passportIssueDate: issueDateObj,
      passportExpiryDate: expiryDateObj,
      applicantHomeAddress1: applicantData.applicantHomeAddress1,
      applicantHomeAddress2: applicantData.applicantHomeAddress2,
      applicantHomeAddress3: applicantData.applicantHomeAddress3,
      applicantHomeAddress4: applicantData.applicantHomeAddress4,
      townOrCity: applicantData.townOrCity,
      provinceOrState: applicantData.provinceOrState,
      country: applicantData.country,
      postcode: applicantData.postcode,
    };
    dispatch(setApplicantDetails(reduxApplicantData));
    if (applicantData.status == "completed") {
      dispatch(setApplicantDetailsStatus(ApplicationStatus.COMPLETE));
    } else {
      dispatch(setApplicantDetailsStatus(ApplicationStatus.INCOMPLETE));
    }
  };

  const updateReduxApplicationDetails = (
    travelData: TravelReturnedDetailsType | undefined,
    medicalScreeningData: MedicalReturnedScreeningType | undefined,
  ) => {
    if (travelData) {
      const reduxTravelData: TravelDetailsType = {
        status: ApplicationStatus.INCOMPLETE,
        visaType: travelData.visaCategory,
        applicantUkAddress1: travelData.ukAddressLine1,
        applicantUkAddress2: travelData.ukAddressLine2,
        applicantUkAddress3: travelData.ukAddressLine3,
        applicantUkAddress4: travelData.ukAddressLine4,
        townOrCity: "", // Bug, missing from BE
        postcode: travelData.ukAddressPostcode,
        ukMobileNumber: travelData.ukMobileNumber,
        ukEmail: travelData.ukEmailAddress,
      };
      dispatch(setTravelDetails(reduxTravelData));
      if (travelData.status == "completed") {
        dispatch(setTravelDetailsStatus(ApplicationStatus.COMPLETE));
      } else {
        dispatch(setTravelDetailsStatus(ApplicationStatus.INCOMPLETE));
      }
    }

    if (medicalScreeningData) {
      const reduxMedicalScreeningData: MedicalScreeningType = {
        status: ApplicationStatus.INCOMPLETE,
        age: medicalScreeningData.age,
        tbSymptoms: medicalScreeningData.symptomsOfTb,
        tbSymptomsList: medicalScreeningData.symptoms,
        otherSymptomsDetail: medicalScreeningData.symptomsOther,
        underElevenConditions: medicalScreeningData.historyOfConditionsUnder11,
        underElevenConditionsDetail: medicalScreeningData.historyOfConditionsUnder11Details,
        previousTb: medicalScreeningData.historyOfPreviousTb,
        previousTbDetail: medicalScreeningData.previousTbDetails,
        closeContactWithTb: medicalScreeningData.contactWithPersonWithTb,
        closeContactWithTbDetail: medicalScreeningData.contactWithTbDetails,
        pregnant: medicalScreeningData.pregnant,
        menstrualPeriods: medicalScreeningData.haveMenstralPeriod,
        physicalExamNotes: medicalScreeningData.physicalExaminationNotes,
      };
      dispatch(setMedicalScreeningDetails(reduxMedicalScreeningData));
      if (medicalScreeningData.status == "completed") {
        dispatch(setMedicalScreeningStatus(ApplicationStatus.COMPLETE));
      } else {
        dispatch(setMedicalScreeningStatus(ApplicationStatus.INCOMPLETE));
      }
    }
  };

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (passportDetails) => {
    try {
      updateReduxPassportDetails(passportDetails);
      try {
        const applicantRes = await axios.get("/api/applicant/search", {
          headers: {
            passportnumber: passportDetails.passportNumber,
            countryofissue: passportDetails.countryOfIssue,
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        updateReduxApplicantDetails(applicantRes.data[0]);
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const applicationId = applicantRes.data[0].applicationId;
          const applicationRes = await axios.get(`/api/application/${applicationId}`);
          updateReduxApplicationDetails(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            applicationRes.data.travelInformation,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            applicationRes.data.medicalScreening,
          );
          navigate("/tracker");
        } catch (error) {
          if (axios.isAxiosError(error) && error.status == 404) {
            navigate("/tracker");
          } else {
            navigate("/error");
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.status == 404) {
          navigate("/applicant-results");
        } else {
          navigate("/error");
        }
      }
    } catch {
      navigate("/error");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FreeText
          id="passport-number"
          label="Applicant's Passport Number"
          errorMessage={errors?.passportNumber?.message ?? ""}
          formValue="passportNumber"
          required="Enter the applicant's passport number."
          patternValue={formRegex.lettersAndNumbers}
          patternError="Passport number must contain only letters and numbers."
        />

        <Dropdown
          id="country-of-issue"
          label="Country of Issue"
          hint="If you have more than one, use the nationality in the primary passport submitted by the applicant. Use the English spelling or the country code."
          options={countryList}
          errorMessage={errors?.countryOfIssue?.message ?? ""}
          formValue="countryOfIssue"
          required="Select the country of issue."
        />

        <Button
          id="search"
          type={ButtonType.DEFAULT}
          text="Search"
          href="#"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default ApplicantSearchForm;
