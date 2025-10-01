import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, FieldErrors, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import DateTextInput from "@/components/dateTextInput/dateTextInput";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FileUpload from "@/components/fileUpload/fileUpload";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import {
  setApicalLordoticXrayFile,
  setApicalLordoticXrayFileName,
  setDateXrayTaken,
  setLateralDecubitusXrayFile,
  setLateralDecubitusXrayFileName,
  setPosteroAnteriorXrayFile,
  setPosteroAnteriorXrayFileName,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplication, selectChestXray } from "@/redux/store";
import { DateType, ReduxChestXrayDetailsType } from "@/types";
import { ButtonType, ImageType } from "@/utils/enums";
import { validateDate } from "@/utils/helpers";
import uploadFile from "@/utils/uploadFile";

const DicomUploadModule = (
  props: Readonly<{
    id: string;
    name: string;
    title: string;
    required: boolean;
    errors?: FieldErrors<ReduxChestXrayDetailsType>;
    formValue: string;
    setFileState: Dispatch<SetStateAction<File | undefined>>;
    setFileName: Dispatch<SetStateAction<string | undefined>>;
    existingFileName?: string;
  }>,
) => {
  return (
    <div>
      <Heading title={props.title} level={3} size="s" />
      <FileUpload
        id={props.id}
        formValue={props.formValue}
        required={props.required ? `Select a ${props.name.toLowerCase()} X-ray image file` : false}
        type={ImageType.Dicom}
        setFileState={props.setFileState}
        setFileName={props.setFileName}
        existingFileName={props.existingFileName}
      />
    </div>
  );
};

const ChestXrayForm = () => {
  const chestXrayData = useAppSelector(selectChestXray);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [PAFile, setPAFile] = useState<File>();
  const [ALFile, setALFile] = useState<File>();
  const [LDFile, setLDFile] = useState<File>();
  const [PAFileName, setPAFileName] = useState<string>();
  const [ALFileName, setALFileName] = useState<string>();
  const [LDFileName, setLDFileName] = useState<string>();

  const methods = useForm<ReduxChestXrayDetailsType>({
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = async (chestXrayData) => {
    setIsLoading(true);

    if (PAFile && PAFileName) {
      const bucketPath = await uploadFile(
        PAFile,
        "postero-anterior.dcm",
        applicationData.applicationId,
        ImageType.Dicom,
      );
      dispatch(setPosteroAnteriorXrayFile(bucketPath));
      dispatch(setPosteroAnteriorXrayFileName(PAFileName));
    }

    if (ALFile && ALFileName) {
      const bucketPath = await uploadFile(
        ALFile,
        "apical-lordotic.dcm",
        applicationData.applicationId,
        ImageType.Dicom,
      );
      dispatch(setApicalLordoticXrayFile(bucketPath));
      dispatch(setApicalLordoticXrayFileName(ALFileName));
    }

    if (LDFile && LDFileName) {
      const bucketPath = await uploadFile(
        LDFile,
        "lateral-decubitus.dcm",
        applicationData.applicationId,
        ImageType.Dicom,
      );
      dispatch(setLateralDecubitusXrayFile(bucketPath));
      dispatch(setLateralDecubitusXrayFileName(LDFileName));
    }

    dispatch(setDateXrayTaken(chestXrayData.dateXrayTaken));
    navigate("/chest-xray-summary");
  };

  const location = useLocation();
  const dateXrayTakenRef = useRef<HTMLDivElement | null>(null);
  const paXrayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "date-xray-taken": dateXrayTakenRef.current,
        "postero-anterior-xray": paXrayRef.current,
      };

      const targetRef = refMap[target];
      if (targetRef) {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <div>
      {isLoading && <Spinner />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
            <Heading level={1} size="l" title="Upload chest X-ray images" />

            <div ref={dateXrayTakenRef}>
              <Controller
                name="dateXrayTaken"
                control={control}
                defaultValue={{
                  day: chestXrayData.dateXrayTaken.day,
                  month: chestXrayData.dateXrayTaken.month,
                  year: chestXrayData.dateXrayTaken.year,
                }}
                rules={{
                  validate: (value: DateType) => validateDate(value, "dateXrayTaken"),
                }}
                render={({ field: { value, onChange } }) => (
                  <DateTextInput
                    heading="When was the X-ray taken?"
                    headingLevel={2}
                    headingSize="m"
                    hint="For example, 31 3 2025"
                    value={value}
                    setDateValue={onChange}
                    id={"date-xray-taken"}
                    autocomplete={false}
                    showTodayYesterdayLinks
                    errorMessage={errors?.dateXrayTaken?.message ?? ""}
                  />
                )}
              />
            </div>

            <Heading level={2} size="m" title="Upload X-ray images" />
            <p className="govuk-body">Upload a file</p>
            <div className="govuk-hint">
              File type must be DICOM. Images must be less than 50MB.
            </div>

            <div ref={paXrayRef}>
              <DicomUploadModule
                id="postero-anterior-xray"
                title="Postero-anterior view"
                formValue="posteroAnteriorXrayFileName"
                name="Postero-anterior"
                setFileState={setPAFile}
                setFileName={setPAFileName}
                required={true}
                errors={errors}
                existingFileName={chestXrayData.posteroAnteriorXrayFileName}
              />
            </div>

            <div>
              <DicomUploadModule
                id="apical-lordotic-xray"
                title="Apical lordotic view (optional)"
                formValue="apicalLordoticXrayFileName"
                name="Apical-lordotic"
                setFileState={setALFile}
                setFileName={setALFileName}
                required={false}
                existingFileName={chestXrayData.apicalLordoticXrayFileName}
              />
            </div>

            <div>
              <DicomUploadModule
                id="lateral-decubitus-xray"
                title="Lateral decubitus view (optional)"
                formValue="lateralDecubitusXrayFileName"
                name="Lateral-decubitus"
                setFileState={setLDFile}
                setFileName={setLDFileName}
                required={false}
                existingFileName={chestXrayData.lateralDecubitusXrayFileName}
              />
            </div>

            <SubmitButton id="continue" type={ButtonType.DEFAULT} text="Continue" />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ChestXrayForm;
