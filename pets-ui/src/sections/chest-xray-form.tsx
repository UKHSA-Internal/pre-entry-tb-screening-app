import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import FileUpload from "@/components/fileUpload/fileUpload";
import Heading from "@/components/heading/heading";
import { selectApplicant } from "@/redux/applicantSlice";
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
    setFileState: Dispatch<SetStateAction<string | null>>;
    setFileName: Dispatch<SetStateAction<string>>;
    existingFileName: string;
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
              accept={props.accept ?? "jpg,jpeg,png,pdf"}
              maxSize={props.maxSize ?? 5}
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

const ChestXrayForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [PAFile, setPAFile] = useState<string | null>(null);
  const [ALFile, setALFile] = useState<string | null>(null);
  const [LDFile, setLDFile] = useState<string | null>(null);
  const [PAFileName, setPAFileName] = useState<string>("");
  const [ALFileName, setALFileName] = useState<string>("");
  const [LDFileName, setLDFileName] = useState<string>("");

  const methods = useForm<ReduxChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = () => {
    dispatch(setPosteroAnteriorXrayFile(PAFile));
    dispatch(setApicalLordoticXrayFile(ALFile));
    dispatch(setLateralDecubitusXrayFile(LDFile));
    dispatch(setPosteroAnteriorXrayFileName(PAFileName));
    dispatch(setApicalLordoticXrayFileName(ALFileName));
    dispatch(setLateralDecubitusXrayFileName(LDFileName));
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
          <ApplicantDataHeader applicantData={applicantData} />

          <div ref={paXray}>
            <Heading level={2} size="m" title="Postero-anterior X-ray" />
            <FileUploadModule
              id="postero-anterior-xray"
              name="Postero-anterior"
              setFileState={setPAFile}
              setFileName={setPAFileName}
              required={true}
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
