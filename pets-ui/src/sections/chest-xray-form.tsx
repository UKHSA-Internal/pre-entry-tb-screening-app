import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import FileUpload from "@/components/fileUpload/fileUpload";
import Radio from "@/components/radio/radio";
import { selectApplicant } from "@/redux/applicantSlice";
import {
  setApicalLordoticXray,
  setApicalLordoticXrayFile,
  setLateralDecubitus,
  setLateralDecubitusFile,
  setPosteroAnteriorFile,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const FileUploadModule = (
  props: Readonly<{
    id: string;
    name: string;
    setFileState: Dispatch<SetStateAction<string | null>>;
    required: boolean;
    errors: FieldErrors<ChestXrayType>;
    accept?: string;
    maxSize?: number;
  }>,
) => {
  return (
    <div>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Type of X-ray</dt>
          <dt className="govuk-summary-list__key">File uploaded</dt>
        </div>

        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__value">{props.name} view</dt>
          <dd className="govuk-summary-list__value">
            <FileUpload
              id={props.id}
              formValue={props.id}
              required={props.required ? `Please upload ${props.name} X-ray` : false}
              errorMessage={props.errors[props.id as keyof ChestXrayType]?.message || ""}
              accept={props.accept || "jpg,jpeg,png,pdf"}
              maxSize={props.maxSize || 5}
              setFileState={props.setFileState}
            />
          </dd>
        </div>
      </dl>
    </div>
  );
};

const ChestXrayForm = (props: Readonly<{ nextpage: string }>) => {
  const applicantData = useAppSelector(selectApplicant);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [hasApicalLordotic, setHasApicalLordotic] = useState(false);
  const [hasLateralDecubitus, setHaslateralDecubitus] = useState(false);

  const [PAFile, setPAFile] = useState<string | null>(null);
  const [ALFile, setALFile] = useState<string | null>(null);
  const [LDFile, setLDFile] = useState<string | null>(null);

  const methods = useForm<ChestXrayType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const onSubmit: SubmitHandler<ChestXrayType> = (data) => {
    updateReduxStore(data);
    navigate(props.nextpage);
  };

  const updateReduxStore = (chestXrayData: ChestXrayType) => {
    // set Files
    dispatch(setPosteroAnteriorFile(PAFile));
    dispatch(setApicalLordoticXrayFile(ALFile));
    dispatch(setLateralDecubitusFile(LDFile));

    // set radio flags
    dispatch(setApicalLordoticXray(chestXrayData.apicalLordoticXray));
    dispatch(setLateralDecubitus(chestXrayData.lateralDecubitus));
  };

  // Watch the value of the radio button for required checks
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
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Name</dt>
              <dd className="govuk-summary-list__value">{applicantData.fullName}</dd>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Date of Birth</dt>
              <dd className="govuk-summary-list__value">
                {applicantData.dateOfBirth.day}/{applicantData.dateOfBirth.month}/
                {applicantData.dateOfBirth.year}
              </dd>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Passport Number</dt>
              <dd className="govuk-summary-list__value">{applicantData.passportNumber}</dd>
            </div>
          </dl>

          <h3 className="govuk-heading-m">Upload the postero-anterior X-ray</h3>
          <FileUploadModule
            id="posteroAnteriorFile"
            name="Postero-anterior"
            setFileState={setPAFile}
            required={true}
            errors={errors}
          />

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
          <FileUploadModule
            id="apicalLordoticXrayFile"
            name="Apical lordotic"
            setFileState={setALFile}
            required={hasApicalLordotic}
            errors={errors}
          />

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
          <FileUploadModule
            id="lateralDecubitusFile"
            name="Lateral decubitus"
            setFileState={setLDFile}
            required={hasLateralDecubitus}
            errors={errors}
          />

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
