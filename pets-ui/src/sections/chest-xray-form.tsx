import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { generateDicomUploadUrl } from "@/api/api";
import { ReduxChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FileUpload from "@/components/fileUpload/fileUpload";
import Heading from "@/components/heading/heading";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import {
  setApicalLordoticXrayFile,
  setLateralDecubitusXrayFile,
  setPosteroAnteriorXrayFile,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/utils/enums";

const FileUploadModule = (
  props: Readonly<{
    id: string;
    name: string;
    setFileState: Dispatch<SetStateAction<File | undefined>>;
    required: boolean;
    errors: FieldErrors<ReduxChestXrayDetailsType>;
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
              required={
                props.required ? `Select a ${props.name.toLowerCase()} X-ray image file` : false
              }
              errorMessage={
                props.errors[props.id as keyof ReduxChestXrayDetailsType]?.message ?? ""
              }
              accept={props.accept}
              maxSize={props.maxSize}
              setFileState={props.setFileState}
            />
          </dd>
        </div>
      </dl>
    </div>
  );
};

async function computeBase64SHA256(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = btoa(String.fromCharCode(...hashArray));
  return hash;
}

const ChestXrayForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [PAFile, setPAFile] = useState<File>();
  const [ALFile, setALFile] = useState<File>();
  const [LDFile, setLDFile] = useState<File>();

  const methods = useForm<ReduxChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const uploadFile = async (file: File, bucketFileName: string) => {
    const { data } = await generateDicomUploadUrl(applicationData.applicationId, {
      fileName: bucketFileName,
      checksum: await computeBase64SHA256(file),
    });

    const { uploadUrl, bucketPath, fields } = data;

    const form = new FormData();
    Object.entries(fields).forEach(([field, value]) => {
      form.append(field, value);
    });
    form.append("file", file);

    await axios.post(uploadUrl, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return bucketPath;
  };

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = async () => {
    // TBBETA-163: Loaders Loaders Loaders
    if (PAFile) {
      const bucketPath = await uploadFile(PAFile, "postero-anterior.dcm");
      dispatch(setPosteroAnteriorXrayFile(bucketPath));
    }

    if (ALFile) {
      const bucketPath = await uploadFile(ALFile, "apical-lordotic.dcm");
      dispatch(setApicalLordoticXrayFile(bucketPath));
    }

    if (LDFile) {
      const bucketPath = await uploadFile(LDFile, "lateral-decubitus.dcm");
      dispatch(setLateralDecubitusXrayFile(bucketPath));
    }

    navigate("/chest-xray-findings");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
          <ApplicantDataHeader applicantData={applicantData} />

          <Heading level={2} size="m" title="Postero-anterior X-ray" />
          <FileUploadModule
            id="postero-anterior-xray"
            name="Postero-anterior"
            setFileState={setPAFile}
            required={true}
            errors={errors}
          />

          <Heading level={2} size="m" title="Apical lordotic X-ray (optional)" />
          <FileUploadModule
            id="apical-lordotic-xray"
            name="Apical-lordotic"
            setFileState={setALFile}
            required={false}
            errors={errors}
          />

          <Heading level={2} size="m" title="Lateral decubitus X-ray (optional)" />
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
