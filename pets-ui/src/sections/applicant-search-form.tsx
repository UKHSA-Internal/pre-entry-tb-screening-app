import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import Dropdown from "@/components/dropdown/dropdown";
import FreeText from "@/components/freeText/freeText";
import {
  clearApplicantDetails,
  setCountryOfIssue,
  setPassportNumber,
} from "@/redux/applicantSlice";
import { useAppDispatch } from "@/redux/hooks";
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
import {
  clearTravelDetails,
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

const ApplicantSearchForm = () => {
  const navigate = useNavigate();

  const methods = useForm<ApplicantSearchFormType>({ reValidateMode: "onSubmit" });

  // on load, clear redux store
  const dispatch = useAppDispatch();

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

  const updateReduxStore = (applicantSearchData: ApplicantSearchFormType) => {
    dispatch(setPassportNumber(applicantSearchData.passportNumber));
    dispatch(setCountryOfIssue(applicantSearchData.countryOfIssue));
  };

  const updateReduxStoreMedical = (medicalScreeningData: MedicalScreeningType) => {
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

  const updateReduxStoreTravel = (travelData: TravelDetailsType) => {
    dispatch(setVisaType(travelData.visaType));
    dispatch(setApplicantUkAddress1(travelData.applicantUkAddress1));
    dispatch(setApplicantUkAddress2(travelData.applicantUkAddress2 ?? ""));
    dispatch(setTownOrCity(travelData.townOrCity));
    dispatch(setPostcode(travelData.postcode));
    dispatch(setUkMobileNumber(travelData.ukMobileNumber ?? ""));
    dispatch(setUkEmail(travelData.ukEmail));
  };

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (data) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      updateReduxStore(data);

      const res = await mockFetch(
        `http://localhost:3000/api/applicant?passportNumber=${data.passportNumber}&countryOfIssue=${data.countryOfIssue}`,
        { method: "GET", headers: myHeaders },
      );

      if (res.status === 200) {
        const resApplication = await mockFetch(
          `http://localhost:3000/api/application?passportNumber=${data.passportNumber}`,
          { method: "GET", headers: myHeaders },
        );

        if (resApplication.status !== 200 && resApplication.status !== 404) {
          throw new Error(); // Error needs to be properly handled in further versions
        }

        if (resApplication.status === 200) {
          updateReduxStoreMedical(resApplication.medicalScreening); // populate
          updateReduxStoreTravel(resApplication.travelInformation); // populate
        }

        navigate("/tracker");
      } else if (res.status === 404) {
        navigate("/applicant-results");
      } else {
        throw new Error(); // Error needs to be properly handled in further versions
      }
    } catch {
      // Error needs to be properly handled in further versions
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
