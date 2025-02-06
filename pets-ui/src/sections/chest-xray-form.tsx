import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import FileUpload from "@/components/fileUpload/fileUpload";
import Radio from "@/components/radio/radio";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
// import { formatDate } from "@/utils/dates";
// Dates to be pulled in from utils from another branch
import { ButtonType, RadioIsInline } from "@/utils/enums";

// This is temporarily needed here
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// end of temporary

function getMonthName(monthNumber?: number | string): string | null {
  const month = parseInt(monthNumber?.toString() || "", 10);

  if (!isNaN(month) && month <= 12) {
    return months[month - 1];
  }
  return "";
}

function formatDate(dateDict: {
  year: number | string;
  month: number | string;
  day: number | string;
}): string {
  return `${dateDict.day} ${getMonthName(dateDict.month)} ${dateDict.year}`;
}

const formTop = (
  fullName: string,
  dateOfBirth: {
    year: number | string;
    month: number | string;
    day: number | string;
  },
  passportNumber: string,
) => {
  return (
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Name</dt>
        <dd className="govuk-summary-list__value">NAME{fullName}</dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date of Birth</dt>
        <dd className="govuk-summary-list__value">DOB{formatDate(dateOfBirth)}</dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Passport Number</dt>
        <dd className="govuk-summary-list__value">PASSPORT{passportNumber}</dd>
      </div>
    </dl>
  );
};

const ChestXrayForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  // const navigate = useNavigate();

  const onSubmit: SubmitHandler<MedicalScreeningType> = (data) => {
    console.log("submit!");
    console.log(data);
  };

  const methods = useForm({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const [hasApicalLordotic, setHasApicalLordotic] = useState(false);
  const [hasLateralDecubitus, setHaslateralDecubitus] = useState(false);

  // Watch the value of the radio button
  const watchedApicalLordotic = watch("apical_lordotic");
  const watchedLateralDecubitus = watch("lateral_decubitus");

  useEffect(() => {
    setHasApicalLordotic(watchedApicalLordotic === "yes" ? true : false);
    setHaslateralDecubitus(watchedLateralDecubitus === "yes" ? true : false);
  }, [watchedApicalLordotic, watchedLateralDecubitus]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {formTop(applicantData.fullName, applicantData.dateOfBirth, applicantData.passportNumber)}

          <h3 className="govuk-heading-m">Upload the postero-anterior X-ray</h3>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Type of X-ray</dt>
              <dt className="govuk-summary-list__key">File uploaded</dt>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__value">Postero-anterior view</dt>
              <dd className="govuk-summary-list__value">
                <FileUpload
                  id="postero_anterior_view"
                  formValue="postero_anterior_view"
                  required="Please upload postero-anterior X-ray"
                  errorMessage={errors?.postero_anterior_view?.message || ""}
                />
              </dd>
            </div>
          </dl>

          <h3 className="govuk-heading-m">Was an apical lordotic X-ray required ?</h3>

          <div>
            <Radio
              id="apical_lordotic"
              // legend="Does the applicant require an apical lordotic X-ray?"
              isInline={RadioIsInline.TRUE}
              answerOptions={["Yes", "No"]}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.apical_lordotic?.message || ""}
              formValue="apical_lordotic"
              required="Please select whether the applicant require an apical lordotic X-ray."
            />
          </div>

          <h3 className="govuk-heading-m">If yes, upload the apical lordotic X-ray</h3>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Type of X-ray</dt>
              <dt className="govuk-summary-list__key">File uploaded</dt>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__value">Apical lordotic view</dt>
              <dd className="govuk-summary-list__value">
                <FileUpload
                  id="apical_lordotic_view"
                  formValue="apical_lordotic_view"
                  errorMessage={errors?.apical_lordotic_view?.message || ""}
                  required={hasApicalLordotic ? "Please upload Apical lordotic X-ray" : false}
                />
              </dd>
            </div>
          </dl>

          <h3 className="govuk-heading-m">Was a lateral decubitus X-ray required ?</h3>

          <div>
            <Radio
              id="lateral_decubitus"
              // legend="Does the applicant require a lateral decubitus  X-ray?"
              isInline={RadioIsInline.TRUE}
              answerOptions={["Yes", "No"]}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.lateral_decubitus?.message || ""}
              formValue="lateral_decubitus"
              required="Please select whether the applicant require a lateral decubitus X-ray."
            />
          </div>

          <h3 className="govuk-heading-m">If yes, upload the lateral decubitus X-ray</h3>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Type of X-ray</dt>
              <dt className="govuk-summary-list__key">File uploaded</dt>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__value">Lateral decubitus view</dt>
              <dd className="govuk-summary-list__value">
                <FileUpload
                  id="lateral_decubitus_view"
                  formValue="lateral_decubitus_view"
                  errorMessage={errors?.lateral_decubitus_view?.message || ""}
                  required={hasLateralDecubitus ? "Please upload Lateral Decubitus X-ray" : false}
                />
              </dd>
            </div>
          </dl>

          <Button
            id="continue"
            type={ButtonType.DEFAULT}
            text="Continue"
            href=""
            handleClick={() => {}}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default ChestXrayForm;
