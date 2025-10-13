import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import ErrorDisplay from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import Summary from "@/components/summary/summary";
import TextArea from "@/components/textArea/textArea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectApplication,
  selectChestXray,
  selectClinic,
  selectMedicalScreening,
  selectTbCertificate,
} from "@/redux/store";
import {
  setCertficateDate,
  setCertificateNumber,
  setComments,
  setDeclaringPhysicianName,
  setTbCertificateStatus,
} from "@/redux/tbCertificateSlice";
import { ReduxTbCertificateType } from "@/types";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import {
  calculateCertificateExpiryDate,
  calculateCertificateIssueDate,
  formatDateForDisplay,
} from "@/utils/helpers";
import { formRegex } from "@/utils/records";

const TbCertificateDeclarationForm = () => {
  const applicationData = useAppSelector(selectApplication);
  const chestXrayData = useAppSelector(selectChestXray);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const clinic = useAppSelector(selectClinic);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const issueDate = calculateCertificateIssueDate(
    chestXrayData.dateXrayTaken,
    medicalScreeningData.chestXrayTaken,
    medicalScreeningData.completionDate,
  );
  const todayFormatted = formatDateForDisplay(issueDate);

  const expiryDate = calculateCertificateExpiryDate(
    issueDate,
    medicalScreeningData.closeContactWithTb === "Yes",
  );
  const expiryFormatted = formatDateForDisplay(expiryDate);

  const methods = useForm<ReduxTbCertificateType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxTbCertificateType> = (data) => {
    dispatch(setComments(data.comments));

    dispatch(
      setCertficateDate({
        day: issueDate.day,
        month: issueDate.month,
        year: issueDate.year,
      }),
    );
    dispatch(setCertificateNumber(applicationData.applicationId));
    dispatch(setDeclaringPhysicianName(data.declaringPhysicianName));
    dispatch(setTbCertificateStatus(ApplicationStatus.IN_PROGRESS));
    navigate("/tb-certificate-summary");
  };

  const errorsToShow = Object.keys(errors);

  const location = useLocation();
  const certificateIssueDate = useRef<HTMLDivElement | null>(null);
  const certificateIssueExpiry = useRef<HTMLDivElement | null>(null);
  const declaringPhysicianName = useRef<HTMLDivElement | null>(null);
  const physicianComments = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "certificate-issue-date": certificateIssueDate.current,
        "certificate-issue-expiry": certificateIssueExpiry.current,
        "declaring-physician-name": declaringPhysicianName.current,
        "physician-comments": physicianComments.current,
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
        {!!errorsToShow?.length && <ErrorDisplay errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Enter clinic and certificate information" />

        <Summary
          status={tbCertificateData.status}
          summaryElements={[
            {
              key: "Clinic name",
              value: clinic.name,
              hiddenLabel: "Clinic name",
            },
            {
              key: "Certificate reference number",
              value: applicationData.applicationId,
              hiddenLabel: "Certificate reference number",
            },
            {
              key: "Certificate issue date",
              value: todayFormatted,
              hiddenLabel: "Certificate issue date",
            },
            {
              key: "Certificate issue expiry",
              value: expiryFormatted,
              hiddenLabel: "Certificate issue expiry",
            },
          ]}
        />

        <div ref={declaringPhysicianName}>
          <FreeText
            id="declaring-physician-name"
            errorMessage={errors?.declaringPhysicianName?.message ?? ""}
            label="Declaring Physician's name"
            formValue="declaringPhysicianName"
            patternValue={formRegex.fullName}
            patternError="Declaring physician's name must contain only letters, spaces, hyphens and apostrophes"
            defaultValue={tbCertificateData.declaringPhysicianName}
            required="Enter the declaring physician's name"
          />
        </div>

        <div ref={physicianComments}>
          <TextArea
            id="physician-comments"
            required={false}
            errorMessage={errors?.comments?.message ?? ""}
            formValue="comments"
            rows={5}
            defaultValue={tbCertificateData.comments}
            label="Physician's notes (optional)"
          />
        </div>

        <SubmitButton id="continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default TbCertificateDeclarationForm;
