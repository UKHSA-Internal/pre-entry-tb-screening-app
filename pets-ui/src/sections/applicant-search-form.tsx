import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import Dropdown from "@/components/dropdown/dropdown";
import FreeText from "@/components/freeText/freeText";
import { clearApplicantDetails } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearMedicalScreeningDetails,
  setAge,
  setCloseContactWithTb,
  setCloseContactWithTbDetail,
  setMenstrualPeriods,
  setOtherSymptomsDetail,
  setPhysicalExamNotes,
  setPregnant,
  setPreviousTb,
  setPreviousTbDetail,
  setTbSymptoms,
  setTbSymptomsList,
  setUnderElevenConditions,
  setUnderElevenConditionsDetail,
} from "@/redux/medicalScreeningSlice";
import { AppDispatch } from "@/redux/store";
import {
  clearTravelDetails,
  selectTravel,
  setApplicantUkAddress1,
  setApplicantUkAddress2,
  setPostcode,
  setTownOrCity,
  setUkEmail,
  setUkMobileNumber,
  setVisaType,
} from "@/redux/travelSlice";
import { ButtonType } from "@/utils/enums";
import { countryList, formRegex } from "@/utils/helpers";
import { mockFetch } from "@/utils/mockFetch";

type ApplicantSearchFormType = {
  passportNumber: string;
  countryOfIssue: string;
};

const populateMedicalScreening = (
  dispatch: AppDispatch,
  medicalScreeningData: MedicalScreeningType,
) => {
  dispatch(setAge(medicalScreeningData.age));
  dispatch(setTbSymptoms(medicalScreeningData.tbSymptoms));
  dispatch(setTbSymptomsList(medicalScreeningData.tbSymptomsList));
  dispatch(setOtherSymptomsDetail(medicalScreeningData.otherSymptomsDetail));
  dispatch(setUnderElevenConditions(medicalScreeningData.underElevenConditions));
  dispatch(setUnderElevenConditionsDetail(medicalScreeningData.underElevenConditionsDetail));
  dispatch(setPreviousTb(medicalScreeningData.previousTb));
  dispatch(setPreviousTbDetail(medicalScreeningData.previousTbDetail));
  dispatch(setCloseContactWithTb(medicalScreeningData.closeContactWithTb));
  dispatch(setCloseContactWithTbDetail(medicalScreeningData.closeContactWithTbDetail));
  dispatch(setPregnant(medicalScreeningData.pregnant));
  dispatch(setMenstrualPeriods(medicalScreeningData.menstrualPeriods));
  dispatch(setPhysicalExamNotes(medicalScreeningData.physicalExamNotes));
};

const populateTravelDetails = (dispatch: AppDispatch, travelData: TravelDetailsType) => {
  dispatch(setVisaType(travelData.visaType));
  dispatch(setApplicantUkAddress1(travelData.applicantUkAddress1));
  dispatch(setApplicantUkAddress2(travelData.applicantUkAddress2 ?? ""));
  dispatch(setTownOrCity(travelData.townOrCity));
  dispatch(setPostcode(travelData.postcode));
  dispatch(setUkMobileNumber(travelData.ukMobileNumber ?? ""));
  dispatch(setUkEmail(travelData.ukEmail));
};

const ApplicantSearchForm = () => {
  const navigate = useNavigate();

  const methods = useForm<ApplicantSearchFormType>({ reValidateMode: "onSubmit" });

  // on load, clear redux store
  const dispatch = useAppDispatch();

  const applicantData = useAppSelector(selectTravel);
  console.log(applicantData);

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (data) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await mockFetch(
        `http://localhost:3000/api/applicant?passportNumber=${data.passportNumber}&countryOfIssue=${data.countryOfIssue}`,
        {
          method: "GET",
          headers: myHeaders,
        },
      ).then(async (res) => {
        if (res.status === 200) {
          await mockFetch(
            `http://localhost:3000/api/application?passportNumber=${data.passportNumber}`,
            {
              method: "GET",
              headers: myHeaders,
            },
          ).then((res) => {
            if (res.status === 200 || res.status === 404) {
              if (res.status === 200) {
                // populate
                populateMedicalScreening(dispatch, res.medicalScreening);
                populateTravelDetails(dispatch, res.travelInformation);
              }
              navigate("/tracker");
            } else {
              console.error(`Got unexpected status code ${res.status}`);
            }
          });
        } else if (res.status === 404) {
          navigate("/applicant-search/404", { state: { passportNumber: data.passportNumber } });
        } else {
          //error or other codes
          console.error(`Got unexpected status code ${res.status}`);
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting POST request:");
        console.error(error?.message);
      } else {
        console.error("Error submitting POST request: unknown error type");
        console.error(error);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FreeText
          id="passportNumber"
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
