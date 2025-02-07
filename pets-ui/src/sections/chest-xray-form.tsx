import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import FileUpload from "@/components/fileUpload/fileUpload";
import Radio from "@/components/radio/radio";
import { selectApplicant } from "@/redux/applicantSlice";
import {
  selectChestXray,
  setApicalLordoticXray,
  setApicalLordoticXrayFile,
  setLateralDecubitus,
  setLateralDecubitusFile,
  setPosteroAnteriorFile,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
// end of temporary

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const CXRData = useAppSelector(selectChestXray);

  const [PAFile, setPAFile] = useState<string | null>(null);
  const [ALFile, setALFile] = useState<string | null>(null);
  const [LDFile, setLDFile] = useState<string | null>(null);

  const updateReduxStore = (chestXrayData: ChestXrayType) => {
    // apical lordotic
    dispatch(setApicalLordoticXray(chestXrayData.apicalLordoticXray));
    // lateral decubitus
    dispatch(setLateralDecubitus(chestXrayData.lateralDecubitus));

    // set PA File
    dispatch(setPosteroAnteriorFile(PAFile));
    if (chestXrayData.apicalLordoticXray) {
      dispatch(setApicalLordoticXrayFile(ALFile));
    }
    if (chestXrayData.lateralDecubitus) {
      dispatch(setLateralDecubitusFile(LDFile));
    }
  };

  const onSubmit: SubmitHandler<ChestXrayType> = (data) => {
    updateReduxStore(data);
    console.log(CXRData);
    // navigate("/radiology-results");
  };

  const methods = useForm<ChestXrayType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const [hasApicalLordotic, setHasApicalLordotic] = useState(false);
  const [hasLateralDecubitus, setHaslateralDecubitus] = useState(false);

  // Watch the value of the radio button
  const watchedApicalLordotic = watch("apicalLordoticXray") as unknown as string;
  const watchedLateralDecubitus = watch("lateralDecubitus") as unknown as string;

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
                  id="posteroAnteriorFile"
                  formValue="posteroAnteriorFile"
                  required="Please upload postero-anterior X-ray"
                  errorMessage={errors?.posteroAnteriorFile?.message || ""}
                  accept="jpg,jpeg,png,pdf"
                  maxSize={5}
                  setFileState={setPAFile}
                />
              </dd>
            </div>
          </dl>

          <h3 className="govuk-heading-m">Was an apical lordotic X-ray required ?</h3>

          <div>
            <Radio
              id="apicalLordoticXray"
              isInline={RadioIsInline.TRUE}
              answerOptions={["Yes", "No"]}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.apicalLordoticXray?.message || ""}
              formValue="apicalLordoticXray"
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
                  id="apicalLordoticXrayFile"
                  formValue="apicalLordoticXrayFile"
                  errorMessage={errors?.apicalLordoticXrayFile?.message || ""}
                  required={hasApicalLordotic ? "Please upload Apical lordotic X-ray" : false}
                  accept="jpg,jpeg,png,pdf"
                  maxSize={5}
                  setFileState={setALFile}
                />
              </dd>
            </div>
          </dl>

          <h3 className="govuk-heading-m">Was a lateral decubitus X-ray required ?</h3>

          <div>
            <Radio
              id="lateralDecubitus"
              isInline={RadioIsInline.TRUE}
              answerOptions={["Yes", "No"]}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.lateralDecubitus?.message || ""}
              formValue="lateralDecubitus"
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
                  id="lateralDecubitusFile"
                  formValue="lateralDecubitusFile"
                  errorMessage={errors?.lateralDecubitusFile?.message || ""}
                  required={hasLateralDecubitus ? "Please upload Lateral Decubitus X-ray" : false}
                  accept="jpg,jpeg,png,pdf"
                  maxSize={5}
                  setFileState={setLDFile}
                />
              </dd>
            </div>
          </dl>

          <Button
            id="continue"
            type={ButtonType.DEFAULT}
            text="Continue"
            href=""
            data-testid="continue"
            handleClick={() => {}}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default ChestXrayForm;
