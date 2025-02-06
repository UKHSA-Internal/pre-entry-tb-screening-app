import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
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
  };

  const methods = useForm({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

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
                <input
                  className="govuk-file-upload"
                  id="file-upload-1"
                  name="fileUpload1"
                  type="file"
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
              required="Select whether the applicant require an apical lordotic X-ray."
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
                <input
                  className="govuk-file-upload"
                  id="file-upload-1"
                  name="fileUpload1"
                  type="file"
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
              required="Select whether the applicant require a lateral decubitus X-ray."
              // defaultValue={""}
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
                <input
                  className="govuk-file-upload"
                  id="file-upload-1"
                  name="fileUpload1"
                  type="file"
                />
              </dd>
            </div>
          </dl>

          <Button
            id="continue"
            type={ButtonType.DEFAULT}
            text="Continue"
            href=""
            // handleClick={() => ()}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default ChestXrayForm;
