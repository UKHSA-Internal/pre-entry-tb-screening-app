import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { putApplicantDetails } from "@/api/api";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import {
  setApplicantDetailsStatus,
  setCountryOfNationality,
  setDob,
  setFullName,
  setSex,
} from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import { DateType, ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus, ButtonClass, RadioIsInline } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";
import { standardiseDayOrMonth, validateDate } from "@/utils/helpers";
import { countryList, formRegex } from "@/utils/records";

interface ApplicantPersonalDetailsData {
  fullName: string;
  dateOfBirth: DateType;
  sex: string;
  countryOfNationality: string;
}

const ApplicantPersonalDetailsForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const isComplete = applicantData.status === ApplicationStatus.COMPLETE;

  const methods = useForm<ReduxApplicantDetailsType>({ reValidateMode: "onSubmit" });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ApplicantPersonalDetailsData> = async (formData) => {
    const fromParam = searchParams.get("from");

    dispatch(setFullName(formData.fullName));
    dispatch(setDob(formData.dateOfBirth));
    dispatch(setSex(formData.sex));
    dispatch(setCountryOfNationality(formData.countryOfNationality));

    if (isComplete && applicationData.applicationId) {
      setIsLoading(true);
      try {
        const dateOfBirthStr = `${formData.dateOfBirth.year}-${standardiseDayOrMonth(formData.dateOfBirth.month)}-${standardiseDayOrMonth(formData.dateOfBirth.day)}`;

        await putApplicantDetails(applicationData.applicationId, {
          fullName: formData.fullName,
          sex: formData.sex,
          dateOfBirth: dateOfBirthStr,
          countryOfNationality: formData.countryOfNationality,
        });

        if (fromParam === "tb-certificate-summary") {
          navigate("/tb-certificate-summary");
        } else if (fromParam === "check-visa-applicant-details") {
          navigate("/check-visa-applicant-details");
        } else {
          navigate("/tb-certificate-summary");
        }
      } catch (error) {
        console.error(error);
        navigate("/sorry-there-is-problem-with-service");
      }
    } else {
      if (!isComplete) {
        dispatch(setApplicantDetailsStatus(ApplicationStatus.IN_PROGRESS));
      }
      navigate("/visa-applicant-passport-information");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Visa applicant personal information", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const nameRef = useRef<HTMLDivElement | null>(null);
  const sexRef = useRef<HTMLDivElement | null>(null);
  const countryOfNationalityRef = useRef<HTMLDivElement | null>(null);
  const dateOfBirthRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        name: nameRef.current,
        sex: sexRef.current,
        "country-of-nationality": countryOfNationalityRef.current,
        "birth-date": dateOfBirthRef.current,
      };

      const targetRef = refMap[target];
      if (targetRef && typeof targetRef.scrollIntoView === "function") {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      {isLoading && <Spinner />}

      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Visa applicant personal information" />

        <div ref={nameRef}>
          <FreeText
            id="name"
            heading="Full name"
            headingSize="m"
            hint="As shown on passport"
            errorMessage={errors?.fullName?.message ?? ""}
            formValue="fullName"
            required="Enter the applicant's full name"
            patternValue={formRegex.fullName}
            patternError="Full name must contain only letters and spaces"
            defaultValue={applicantData.fullName}
          />
        </div>

        <div ref={dateOfBirthRef}>
          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue={{
              day: applicantData.dateOfBirth.day,
              month: applicantData.dateOfBirth.month,
              year: applicantData.dateOfBirth.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "dateOfBirth"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                heading="Date of birth"
                hint="For example, 26 4 2002"
                headingSize="m"
                value={value}
                setDateValue={onChange}
                id={"birth-date"}
                autocomplete={false}
                errorMessage={errors?.dateOfBirth?.message ?? ""}
              />
            )}
          />
        </div>

        <div ref={sexRef}>
          <Radio
            id="sex"
            heading="Sex assigned at birth"
            hint="Select the visa applicant's sex assigned at birth"
            headingSize="m"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Female", "Male"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.sex?.message ?? ""}
            formValue="sex"
            required="Select the applicant's sex"
            defaultValue={applicantData.sex}
          />
        </div>

        <div ref={countryOfNationalityRef}>
          <Dropdown
            id="country-of-nationality"
            heading="Country of nationality"
            headingSize="m"
            options={countryList}
            placeholder="Select country"
            errorMessage={errors?.countryOfNationality?.message ?? ""}
            formValue="countryOfNationality"
            required="Select the country of nationality"
            defaultValue={applicantData.countryOfNationality}
          />
        </div>

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantPersonalDetailsForm;
