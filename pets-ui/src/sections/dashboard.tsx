import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getApplication } from "@/api/api";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import Spinner from "@/components/spinner/spinner";
import Table from "@/components/table/table";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { setApplicantPhotoFileName } from "@/redux/applicantSlice";
import { clearApplicationDetails, setApplicationDetails } from "@/redux/applicationSlice";
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
import { selectUserClinic } from "@/redux/store";
import {
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} from "@/redux/tbCertificateSlice";
import { clearTravelDetails, setTravelDetailsFromApiResponse } from "@/redux/travelSlice";
import { fetchClinic } from "@/utils/clinic";
import { ApplicationStatus, TaskStatus, YesOrNo } from "@/utils/enums";
import { convertDateStrToObj, formatDateForDisplay, getCountryName } from "@/utils/helpers";
import { ReceivedApplicationsInProgressType } from "@/types";

const getApplicationsResFixture: ReceivedApplicationsInProgressType = {
  applications: [
    {
      applicationId: "9189a071-945b-4834-a6cb-8748c4746eba",
      applicantId: "COUNTRY#AFG#PASSPORT#abc1",
      applicantName: "Name One",
      passportNumber: "abc1",
      countryOfIssue: "AFG",
      clinicId: "UK/LHR/00/",
      dateCreated: "2021-04-07T15:32:34.470Z",
      applicationStatus: ApplicationStatus.IN_PROGRESS,
    },
    {
      applicationId: "b1a2f682-9281-4b92-b4ef-878edfd06d23",
      applicantId: "COUNTRY#AFG#PASSPORT#abc2",
      applicantName: "Name Two",
      passportNumber: "abc2",
      countryOfIssue: "AFG",
      clinicId: "UK/LHR/00/",
      dateCreated: "2026-04-07T15:32:34.470Z",
      applicationStatus: ApplicationStatus.IN_PROGRESS,
    },
    {
      applicationId: "17811cbc-501d-4051-94ae-67692fe6f393",
      applicantId: "COUNTRY#AFG#PASSPORT#abc3",
      applicantName: "Name Three",
      passportNumber: "abc3",
      countryOfIssue: "AFG",
      clinicId: "UK/LHR/00/",
      dateCreated: "2023-04-07T15:32:34.470Z",
      applicationStatus: ApplicationStatus.IN_PROGRESS,
    },
    {
      applicationId: "17811cbc-501d-4051-94ae-67692fe6f363",
      applicantId: "COUNTRY#AFG#PASSPORT#abc4",
      applicantName: "Should not see - different clinic",
      passportNumber: "abc4",
      countryOfIssue: "AFG",
      clinicId: "UK/LHR/01/",
      dateCreated: "2026-04-07T15:32:34.470Z",
      applicationStatus: ApplicationStatus.IN_PROGRESS,
    },
    {
      applicationId: "17814cbc-501d-4051-94ae-67692fe6f363",
      applicantId: "COUNTRY#AFG#PASSPORT#abc9",
      applicantName: "Should not see - different status",
      passportNumber: "abc9",
      countryOfIssue: "AFG",
      clinicId: "UK/LHR/00/",
      dateCreated: "2026-04-07T15:32:34.470Z",
      applicationStatus: ApplicationStatus.CERTIFICATE_NOT_ISSUED,
    },
  ],
  cursor: null,
};

const Dashboard = () => {
  const userClinicData = useAppSelector(selectUserClinic);
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

  const loadSingleApplication = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    applicationId: string,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

  const applicationTableInfo = getApplicationsResFixture.applications
    .filter((app) => app.clinicId == userClinicData.clinicId)
    .filter((app) => app.applicationStatus == ApplicationStatus.IN_PROGRESS)
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
          title="Continue with screening"
          to="/tracker"
          externalLink={false}
          onClick={(e) => loadSingleApplication(e, app.applicationId)}
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
