import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MedicalScreeningType, TravelDetailsType } from "@/applicant";
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
  setMedicalScreeningDetails,
} from "@/redux/medicalScreeningSlice";
import { clearTravelDetails, setTravelDetails } from "@/redux/travelSlice";
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const updateReduxStoreSearch = (applicantSearchData: ApplicantSearchFormType) => {
    dispatch(setPassportNumber(applicantSearchData.passportNumber));
    dispatch(setCountryOfIssue(applicantSearchData.countryOfIssue));
  };

  const updateReduxStoreApplication = (
    medicalScreeningData?: MedicalScreeningType,
    travelData?: TravelDetailsType,
  ) => {
    if (medicalScreeningData) dispatch(setMedicalScreeningDetails(medicalScreeningData));
    if (travelData) dispatch(setTravelDetails(travelData));
  };

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (data) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      updateReduxStoreSearch(data);

      const res = await mockFetch(
        `http://localhost:3000/api/applicant?passportNumber=${data.passportNumber}&countryOfIssue=${data.countryOfIssue}`,
        { method: "GET", headers: myHeaders },
      );

      if (res.status === 200) {
        const resApp = await mockFetch(
          `http://localhost:3000/api/application?passportNumber=${data.passportNumber}`,
          { method: "GET", headers: myHeaders },
        );

        if (resApp.status !== 200 && resApp.status !== 404) {
          throw new Error(); // Error needs to be properly handled in further versions
        }

        if (resApp.status === 200) {
          updateReduxStoreApplication(resApp.medicalScreening, resApp.travelInformation);
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
