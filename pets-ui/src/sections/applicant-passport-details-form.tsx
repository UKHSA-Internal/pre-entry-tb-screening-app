import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { putApplicantDetails } from "@/api/api";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import Summary from "@/components/summary/summary";
import {
  setCountryOfIssue,
  setPassportExpiryDate,
  setPassportIssueDate,
  setPassportNumber,
} from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import { DateType, ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus, ButtonClass } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";
import { getCountryName, standardiseDayOrMonth, validateDate } from "@/utils/helpers";
import { countryList, formRegex } from "@/utils/records";

interface ApplicantPassportDetailsData {
  passportNumber: string;
  countryOfIssue: string;
  passportIssueDate: DateType;
  passportExpiryDate: DateType;
}

const ApplicantPassportDetailsForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const isComplete = applicantData.status === ApplicationStatus.COMPLETE;
  const summaryStatus = isComplete ? ApplicationStatus.IN_PROGRESS : applicantData.status;

  const methods = useForm<ReduxApplicantDetailsType>({ reValidateMode: "onSubmit" });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ApplicantPassportDetailsData> = async (formData) => {
    const fromParam = searchParams.get("from");

    if (!isComplete) {
      dispatch(setPassportNumber(formData.passportNumber));
      dispatch(setCountryOfIssue(formData.countryOfIssue));
    }
    dispatch(setPassportIssueDate(formData.passportIssueDate));
    dispatch(setPassportExpiryDate(formData.passportExpiryDate));

    if (isComplete && applicationData.applicationId) {
      setIsLoading(true);
      try {
        const issueDateStr = `${formData.passportIssueDate.year}-${standardiseDayOrMonth(formData.passportIssueDate.month)}-${standardiseDayOrMonth(formData.passportIssueDate.day)}`;
        const expiryDateStr = `${formData.passportExpiryDate.year}-${standardiseDayOrMonth(formData.passportExpiryDate.month)}-${standardiseDayOrMonth(formData.passportExpiryDate.day)}`;

        await putApplicantDetails(applicationData.applicationId, {
          passportNumber: applicantData.passportNumber,
          countryOfIssue: applicantData.countryOfIssue,
          issueDate: issueDateStr,
          expiryDate: expiryDateStr,
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
      navigate("/visa-applicant-contact-information");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Visa applicant passport information", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const passportNumberRef = useRef<HTMLDivElement | null>(null);
  const countryOfIssueRef = useRef<HTMLDivElement | null>(null);
  const passportIssueDateRef = useRef<HTMLDivElement | null>(null);
  const passportExpiryDateRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "passport-number": passportNumberRef.current,
        "country-of-issue": countryOfIssueRef.current,
        "passport-issue-date": passportIssueDateRef.current,
        "passport-expiry-date": passportExpiryDateRef.current,
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

        <Heading level={1} size="l" title="Visa applicant passport information" />

        {isComplete && (
          <Summary
            status={summaryStatus}
            summaryElements={[
              {
                key: "Passport number",
                value: applicantData.passportNumber,
                hiddenLabel: "passport number",
              },
              {
                key: "Country of issue",
                value: getCountryName(applicantData.countryOfIssue),
                hiddenLabel: "country of issue",
              },
            ]}
          />
        )}

        {!isComplete && (
          <div ref={passportNumberRef}>
            <FreeText
              id="passport-number"
              heading="Passport number"
              headingSize="m"
              hint="For example, 1208297A"
              errorMessage={errors?.passportNumber?.message ?? ""}
              formValue="passportNumber"
              required="Enter the applicant's passport number"
              patternValue={formRegex.lettersAndNumbers}
              patternError="Passport number must contain only letters and numbers"
              defaultValue={applicantData.passportNumber}
            />
          </div>
        )}

        {!isComplete && (
          <div ref={countryOfIssueRef}>
            <Dropdown
              id="country-of-issue"
              heading="Country of issue"
              headingSize="m"
              placeholder="Select country"
              hint="As shown on passport, at the top of the first page"
              options={countryList}
              errorMessage={errors?.countryOfIssue?.message ?? ""}
              formValue="countryOfIssue"
              required="Select the country of issue"
              defaultValue={applicantData.countryOfIssue}
            />
          </div>
        )}

        <div ref={passportIssueDateRef}>
          <Controller
            name="passportIssueDate"
            control={control}
            defaultValue={{
              day: applicantData.passportIssueDate.day,
              month: applicantData.passportIssueDate.month,
              year: applicantData.passportIssueDate.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "passportIssueDate"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                heading="Issue date"
                headingSize="m"
                hint="For example, 31 3 2019"
                value={value}
                setDateValue={onChange}
                id={"passport-issue-date"}
                autocomplete={false}
                errorMessage={errors?.passportIssueDate?.message ?? ""}
              />
            )}
          />
        </div>

        <div ref={passportExpiryDateRef}>
          <Controller
            name="passportExpiryDate"
            control={control}
            defaultValue={{
              day: applicantData.passportExpiryDate.day,
              month: applicantData.passportExpiryDate.month,
              year: applicantData.passportExpiryDate.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "passportExpiryDate"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                heading="Expiry date"
                headingSize="m"
                hint="For example, 31 3 2019"
                value={value}
                setDateValue={onChange}
                id="passport-expiry-date"
                autocomplete={false}
                errorMessage={errors?.passportExpiryDate?.message ?? ""}
              />
            )}
          />
        </div>

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantPassportDetailsForm;
