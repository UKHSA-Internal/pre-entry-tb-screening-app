import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { putTravelDetails } from "@/api/api";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import { setTravelDetailsStatus, setVisaCategory } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonClass } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";
import { visaOptions } from "@/utils/records";

interface TravelVisaCategoryData {
  visaCategory: string;
}

const ApplicantTravelVisaCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  const dispatch = useAppDispatch();
  const travelData = useAppSelector(selectTravel);
  const applicationData = useAppSelector(selectApplication);

  const methods = useForm<TravelVisaCategoryData>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<TravelVisaCategoryData> = async (visaCategoryData) => {
    dispatch(setVisaCategory(visaCategoryData.visaCategory));

    if (travelData.status === ApplicationStatus.COMPLETE && applicationData.applicationId) {
      try {
        await putTravelDetails(applicationData.applicationId, {
          visaCategory: visaCategoryData.visaCategory,
        });

        if (fromParam === "/check-travel-information") {
          navigate("/check-travel-information");
        } else {
          navigate("/tb-certificate-summary");
        }
      } catch (error) {
        console.error(error);
        navigate("/error");
      }
    } else {
      dispatch(setTravelDetailsStatus(ApplicationStatus.IN_PROGRESS));
      navigate("/visa-applicant-proposed-uk-address");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Proposed visa category", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const visaCategoryRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "visa-category" && visaCategoryRef.current) {
        visaCategoryRef.current.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <div ref={visaCategoryRef}>
          <Dropdown
            id="visa-category"
            heading="Proposed visa category"
            headingLevel={1}
            headingSize="l"
            options={visaOptions}
            errorMessage={errors?.visaCategory?.message ?? ""}
            formValue="visaCategory"
            required="Select visa category"
            defaultValue={travelData.visaCategory}
            placeholder="Select visa category"
          />
        </div>

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantTravelVisaCategory;
