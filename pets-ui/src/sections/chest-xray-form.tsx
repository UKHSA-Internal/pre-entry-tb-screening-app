import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

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
  selectChestXray,
  setApicalLordoticXrayFile,
  setApicalLordoticXrayFileName,
  setLateralDecubitusXrayFile,
  setLateralDecubitusXrayFileName,
  setPosteroAnteriorXrayFile,
  setPosteroAnteriorXrayFileName,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/utils/enums";

const FileUploadModule = (
  props: Readonly<{
    id: string;
    name: string;
    required: boolean;
    errors: FieldErrors<ReduxChestXrayDetailsType>;
    accept?: string;
    maxSize?: number;
    setFileState: Dispatch<SetStateAction<File | undefined>>;
    setFileName: Dispatch<SetStateAction<string | undefined>>;
    existingFileName?: string;
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
              setFileName={props.setFileName}
              existingFileName={props.existingFileName}
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
  const chestXrayData = useAppSelector(selectChestXray);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [PAFile, setPAFile] = useState<File>();
  const [ALFile, setALFile] = useState<File>();
  const [LDFile, setLDFile] = useState<File>();
  const [PAFileName, setPAFileName] = useState<string>();
  const [ALFileName, setALFileName] = useState<string>();
  const [LDFileName, setLDFileName] = useState<string>();

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
    if (PAFile && PAFileName) {
      const bucketPath = await uploadFile(PAFile, "postero-anterior.dcm");
      dispatch(setPosteroAnteriorXrayFile(bucketPath));
      dispatch(setPosteroAnteriorXrayFileName(PAFileName));
    }

    if (ALFile && ALFileName) {
      const bucketPath = await uploadFile(ALFile, "apical-lordotic.dcm");
      dispatch(setApicalLordoticXrayFile(bucketPath));
      dispatch(setApicalLordoticXrayFileName(ALFileName));
    }

    if (LDFile && LDFileName) {
      const bucketPath = await uploadFile(LDFile, "lateral-decubitus.dcm");
      dispatch(setLateralDecubitusXrayFile(bucketPath));
      dispatch(setLateralDecubitusXrayFileName(LDFileName));
    }

    navigate("/chest-xray-findings");
  };

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const paXray = useRef<HTMLDivElement | null>(null);
  const alXray = useRef<HTMLDivElement | null>(null);
  const ldXray = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "postero-anterior-xray": paXray.current,
        "apical-lordotic-xray": alXray.current,
        "lateral-decubitus-xray": ldXray.current,
      };

      const targetRef = refMap[target];
      if (targetRef) {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
          <ApplicantDataHeader applicantData={applicantData} />

          <div ref={paXray}>
            <Heading level={2} size="m" title="Postero-anterior X-ray" />
            <FileUploadModule
              id="postero-anterior-xray"
              name="Postero-anterior"
              setFileState={setPAFile}
              setFileName={setPAFileName}
              required={!chestXrayData.posteroAnteriorXrayFile}
              errors={errors}
              existingFileName={chestXrayData.posteroAnteriorXrayFileName}
            />
          </div>

          <div ref={alXray}>
            <Heading level={2} size="m" title="Apical lordotic X-ray (optional)" />
            <FileUploadModule
              id="apical-lordotic-xray"
              name="Apical-lordotic"
              setFileState={setALFile}
              setFileName={setALFileName}
              required={false}
              errors={errors}
              existingFileName={chestXrayData.apicalLordoticXrayFileName}
            />
          </div>

          <div ref={ldXray}>
            <Heading level={2} size="m" title="Lateral decubitus X-ray (optional)" />
            <FileUploadModule
              id="lateral-decubitus-xray"
              name="Lateral-decubitus"
              setFileState={setLDFile}
              setFileName={setLDFileName}
              required={false}
              errors={errors}
              existingFileName={chestXrayData.lateralDecubitusXrayFileName}
            />
          </div>

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
