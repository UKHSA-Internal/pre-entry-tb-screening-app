import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { validate as uuidValidate } from "uuid";

import { getApplicants, getApplication } from "@/api/api";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import Spinner from "@/components/spinner/spinner";
import Table from "@/components/table/table";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import {
  setApplicantDetailsFromApiResponse,
  setApplicantPassportDetails,
  setApplicantPhotoFileName,
} from "@/redux/applicantSlice";
import { clearApplicationDetails, setApplicationDetails } from "@/redux/applicationSlice";
import { setApplicationsListDetailsFromApiResponse } from "@/redux/applicationsListSlice";
import { clearChestXrayDetails, setChestXrayFromApiResponse } from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearMedicalScreeningDetails,
  setMedicalScreeningDetailsFromApiResponse,
} from "@/redux/medicalScreeningSlice";
import {
  clearRadiologicalOutcomeDetails,
  setRadiologicalOutcomeFromApiResponse,
} from "@/redux/radiologicalOutcomeSlice";
import {
  clearSputumDecision,
  setSputumDecisionRequired,
  setSputumDecisionStatus,
} from "@/redux/sputumDecisionSlice";
import {
  clearSputumDetails,
  setSputumDetailsFromApiResponse,
  setSputumStatus,
} from "@/redux/sputumSlice";
import { selectApplicationsInProgress, selectUserClinic } from "@/redux/store";
import {
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} from "@/redux/tbCertificateSlice";
import { clearTravelDetails, setTravelDetailsFromApiResponse } from "@/redux/travelSlice";
import { ReceivedApplicantDetailsType } from "@/types";
import { fetchClinic } from "@/utils/clinic";
import { ApplicationStatus, TaskStatus, YesOrNo } from "@/utils/enums";
import { convertDateStrToObj, formatDateForDisplay, getCountryName } from "@/utils/helpers";

const Dashboard = () => {
  const userClinicData = useAppSelector(selectUserClinic);
  const applicationsInProgressData = useAppSelector(selectApplicationsInProgress);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setApplicantPhotoUrl, setApplicantPhotoFile } = useApplicantPhoto();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(clearApplicationDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());
    dispatch(clearChestXrayDetails());
    dispatch(clearRadiologicalOutcomeDetails());
    dispatch(clearSputumDetails());
    dispatch(clearSputumDecision());
    dispatch(clearTbCertificateDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplicantPhoto = async (photoUrl: string) => {
    const env = import.meta.env.VITE_ENVIRONMENT as string | undefined;
    const fixedUrl =
      env === "local" ? photoUrl.replace(/172\.\d+\.\d+\.\d+:4566/, "localhost:4566") : photoUrl;

    const urlParts = photoUrl.split("/");
    const filename = urlParts.pop()?.split("?")[0] ?? "applicant-photo.jpg";
    dispatch(setApplicantPhotoFileName(filename));
    const response = await fetch(fixedUrl);
    const blob = await response.blob();
    if (typeof File == "undefined") {
      setApplicantPhotoUrl(fixedUrl);
    } else {
      try {
        const file = new File([blob], filename, { type: blob.type });
        setApplicantPhotoFile(file);
      } catch {
        setApplicantPhotoUrl(fixedUrl);
      }
    }
  };

  const loadApplicantAndApplication = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    applicationId: string,
    passportNumber: string,
    countryOfIssue: string,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    let applicantRes: AxiosResponse<ReceivedApplicantDetailsType> | null = null;

    try {
      dispatch(
        setApplicantPassportDetails({
          passportNumber: passportNumber,
          countryOfIssue: countryOfIssue,
        }),
      );
      setApplicantPhotoUrl(null);
      applicantRes = await getApplicants({
        passportNumber: passportNumber,
        countryOfIssue: countryOfIssue,
      });
      for (const application of applicantRes.data.applications) {
        const applicationId = application.applicationId;
        if (!uuidValidate(application.applicationId)) {
          throw new Error(`Application ID (${applicationId}) is in an invalid UUID format`);
        }
      }
      dispatch(setApplicantDetailsFromApiResponse(applicantRes.data));
      dispatch(setApplicationsListDetailsFromApiResponse(applicantRes.data.applications));

      const applicationRes = await getApplication(applicationId);
      dispatch(
        setApplicationDetails({
          applicationId: applicationId,
          applicationStatus: applicationRes.data.applicationStatus,
          clinicId: applicationRes.data.clinicId,
          dateCreated: convertDateStrToObj(applicationRes?.data.dateCreated ?? ""),
          dateUpdated: convertDateStrToObj(applicationRes?.data.dateUpdated ?? ""),
          expiryDate: convertDateStrToObj(applicationRes?.data.expiryDate ?? ""),
          cancellationReason: applicationRes.data.cancellationReason ?? "",
          cancellationFurtherInfo: applicationRes.data.cancellationFurtherInfo ?? "",
        }),
      );
      const applicationClinicId = applicationRes.data.clinicId as string | undefined;
      await fetchClinic(dispatch, applicationClinicId);

      if (applicationRes.data.applicantPhotoUrl) {
        await handleApplicantPhoto(applicationRes.data.applicantPhotoUrl);
      }

      if (applicationRes.data.travelInformation) {
        dispatch(setTravelDetailsFromApiResponse(applicationRes.data.travelInformation));
      }
      if (applicationRes.data.medicalScreening) {
        dispatch(setMedicalScreeningDetailsFromApiResponse(applicationRes.data.medicalScreening));
      }
      if (applicationRes.data.chestXray) {
        dispatch(setChestXrayFromApiResponse(applicationRes.data.chestXray));
      }
      if (applicationRes.data.radiologicalOutcome) {
        dispatch(setRadiologicalOutcomeFromApiResponse(applicationRes.data.radiologicalOutcome));
      }
      if (applicationRes.data.sputumRequirement) {
        dispatch(setSputumDecisionRequired(applicationRes.data.sputumRequirement.sputumRequired));
        dispatch(setSputumDecisionStatus(TaskStatus.COMPLETE));
        if (applicationRes.data.sputumRequirement.sputumRequired === YesOrNo.NO) {
          dispatch(setSputumStatus(TaskStatus.NOT_REQUIRED));
        }
      }
      if (
        applicationRes.data.sputumDetails &&
        applicationRes.data.sputumRequirement?.sputumRequired !== YesOrNo.NO
      ) {
        dispatch(setSputumDetailsFromApiResponse(applicationRes.data.sputumDetails));
      }
      if (applicationRes.data.tbCertificate) {
        dispatch(setTbCertificateFromApiResponse(applicationRes.data.tbCertificate));
      }
      navigate("/tracker");
      return;
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
      return;
    }
  };

  const applicationTableInfo = applicationsInProgressData.applications
    .filter((app) => app.clinicId == userClinicData.clinicId)
    .sort(
      (app1, app2) => new Date(app2.dateCreated).getTime() - new Date(app1.dateCreated).getTime(),
    )
    .map((app) => ({
      rowTitle: app.applicantName,
      cells: [
        app.passportNumber,
        getCountryName(app.countryOfIssue),
        formatDateForDisplay(convertDateStrToObj(app.dateCreated)),
        <LinkLabel
          key={app.applicationId}
          title={
            app.applicationStatus == ApplicationStatus.SPUTUM_IN_PROGRESS
              ? "Continue: sputum results"
              : "Continue with screening"
          }
          to="/tracker"
          externalLink={false}
          onClick={async (e) => {
            setIsLoading(true);
            await loadApplicantAndApplication(
              e,
              app.applicationId,
              app.passportNumber,
              app.countryOfIssue,
            );
          }}
        />,
      ],
    }));

  return (
    <div>
      {isLoading && <Spinner />}
      <Table
        columnHeaders={[
          "Name",
          "Passport number",
          "Country of issue",
          "Screening start date",
          "Next task",
        ]}
        tableRows={applicationTableInfo}
        removeRowTitleStyling
      />
    </div>
  );
};

export default Dashboard;
