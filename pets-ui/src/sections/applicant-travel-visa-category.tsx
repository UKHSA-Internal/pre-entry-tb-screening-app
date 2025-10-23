import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { putTravelDetails } from "@/api/api";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import { setTravelDetailsStatus, setVisaCategory } from "@/redux/travelSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { visaOptions } from "@/utils/records";

interface TravelVisaCategoryData {
  visaCategory: string;
}

const ApplicantTravelVisaCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

        navigate("/tb-certificate-summary");
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

        <SubmitButton id="continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantTravelVisaCategory;
