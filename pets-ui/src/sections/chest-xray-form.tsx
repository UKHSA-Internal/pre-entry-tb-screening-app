import { Dispatch, SetStateAction, useState } from "react";
import { FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import FileUpload from "@/components/fileUpload/fileUpload";
import { selectApplicant } from "@/redux/applicantSlice";
import {
  setPosteroAnteriorXrayFile,
  setApicalLordoticXrayFile,
  setLateralDecubitusXrayFile,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/utils/enums";

const FileUploadModule = (
  props: Readonly<{
    id: string;
    name: string;
    setFileState: Dispatch<SetStateAction<string | null>>;
    required: boolean;
    errors: FieldErrors<ChestXrayDetailsType>;
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
              required={props.required ? `Please upload ${props.name.toLowerCase()} X-ray` : false}
              errorMessage={props.errors[props.id as keyof ChestXrayDetailsType]?.message ?? ""}
              accept={props.accept ?? "jpg,jpeg,png,pdf"}
              maxSize={props.maxSize ?? 5}
              setFileState={props.setFileState}
            />
          </dd>
        </div>
      </dl>
    </div>
  );
};

const ChestXrayForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [PAFile, setPAFile] = useState<string | null>(null);
  const [ALFile, setALFile] = useState<string | null>(null);
  const [LDFile, setLDFile] = useState<string | null>(null);

  const methods = useForm<ChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ChestXrayDetailsType> = () => {
    updateReduxStore();
    navigate("/chest-xray-findings");
  };

  const updateReduxStore = () => {
    dispatch(setPosteroAnteriorXrayFile(PAFile));
    dispatch(setApicalLordoticXrayFile(ALFile));
    dispatch(setLateralDecubitusXrayFile(LDFile));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <ApplicantDataHeader applicantData={applicantData} />

          <h3 className="govuk-heading-m">Postero-anterior X-ray</h3>
          <FileUploadModule
            id="postero-anterior-xray"
            name="Postero-anterior"
            setFileState={setPAFile}
            required={true}
            errors={errors}
          />

          <h3 className="govuk-heading-m">Apical lordotic X-ray (optional)</h3>
          <FileUploadModule
            id="apical-lordotic-xray"
            name="Apical-lordotic"
            setFileState={setALFile}
            required={false}
            errors={errors}
          />

          <h3 className="govuk-heading-m">Lateral decubitus X-ray (optional)</h3>
          <FileUploadModule
            id="lateral-decubitus-xray"
            name="Lateral-decubitus"
            setFileState={setLDFile}
            required={false}
            errors={errors}
          />

          <Button
            id="continue"
            type={ButtonType.DEFAULT}
            text="Continue"
            href="/chest-xray-findings"
            handleClick={() => {}}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default ChestXrayForm;
