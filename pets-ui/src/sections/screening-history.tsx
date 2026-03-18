import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getApplication } from "@/api/api";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Details from "@/components/details/details";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import Spinner from "@/components/spinner/spinner";
import StartButton from "@/components/startButton/startButton";
import StatusTag from "@/components/statusTag/statusTag";
import Table from "@/components/table/table";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { setApplicantDetailsStatus, setApplicantPhotoFileName } from "@/redux/applicantSlice";
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
import { selectApplicant, selectApplicationsList } from "@/redux/store";
import {
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} from "@/redux/tbCertificateSlice";
import { clearTravelDetails, setTravelDetailsFromApiResponse } from "@/redux/travelSlice";
import { ReduxApplicationDetailsType } from "@/types";
import { fetchClinic } from "@/utils/clinic";
// import { getClinicId } from "@/utils/clinic";
import { ApplicationStatus, TaskStatus, YesOrNo } from "@/utils/enums";
import { convertDateStrToObj, formatDateForDisplay } from "@/utils/helpers";

// const currentClinicId = await getClinicId(); // this line currently causes Uncaught BrowserAuthError
const currentClinicId = "UK/LHR/00/"; // placeholder so page can be tested

const getApplicationExpiryDate = (application: ReduxApplicationDetailsType): string => {
  if (
    application.applicationStatus == ApplicationStatus.CANCELLED ||
    application.applicationStatus == ApplicationStatus.CERTIFICATE_NOT_ISSUED
  ) {
    return "Not applicable";
  } else if (
    application.expiryDate &&
    application.expiryDate.year &&
    application.expiryDate.month &&
    application.expiryDate.day
  ) {
    return formatDateForDisplay(application.expiryDate);
  } else {
    return "No data";
  }
};

const ScreeningHistory = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationsListData = useAppSelector(selectApplicationsList);
  const applicantPhotoContext = useApplicantPhoto();
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

  const getApplicationAction = (
    application: ReduxApplicationDetailsType,
  ): string | React.JSX.Element => {
    if (application.clinicId == currentClinicId) {
      return (
        <LinkLabel
          title={
            application.applicationStatus == ApplicationStatus.IN_PROGRESS
              ? "Continue screening"
              : "View screening"
          }
          to="/tracker"
          externalLink={false}
          onClick={(e) => loadSingleApplication(e, application.applicationId)}
        />
      );
    } else {
      return "Not available: screening at another clinic";
    }
  };

  const appFromOtherClinic = applicationsListData.some(
    (application) => application.clinicId !== currentClinicId,
  );

  const noInProgressApps = applicationsListData.every(
    (application) => application.applicationStatus !== ApplicationStatus.IN_PROGRESS,
  );

  const applicationTableInfo = applicationsListData.map((application, index) => ({
    rowTitle: formatDateForDisplay(application.dateCreated),
    cells: [
      getApplicationExpiryDate(application),
      <StatusTag key={index} status={application.applicationStatus} />,
      getApplicationAction(application),
    ],
  }));

  return (
    <div>
      {isLoading && <Spinner />}
      <div className="govuk-grid-row progress-tracker-header">
        <div className="govuk-grid-column-two-thirds progress-tracker-header-content">
          <ApplicantDataHeader applicantData={applicantData} showCountryOfIssue={true} />
        </div>
        {applicantPhotoContext?.applicantPhotoDataUrl ? (
          <div className="govuk-grid-column-one-third progress-tracker-photo-container">
            <img
              src={applicantPhotoContext.applicantPhotoDataUrl}
              alt={"Applicant"}
              title={applicantData.applicantPhotoFileName ?? undefined}
              className="progress-tracker-photo"
            />
          </div>
        ) : (
          <div className="govuk-grid-column-one-third" />
        )}
      </div>

      {noInProgressApps && (
        <div>
          <Heading title="Start a new screening" level={2} size="s" />
          <StartButton
            id="start-new-screening"
            text="Start now"
            handleClick={() => {
              setIsLoading(true);
              dispatch(setApplicantDetailsStatus(TaskStatus.IN_PROGRESS));
              navigate("/do-you-have-visa-applicant-written-consent-for-tb-screening");
              return;
            }}
          />
        </div>
      )}

      {appFromOtherClinic && (
        <>
          <br />
          <br />
          <Details
            summary="Help with screening details that are not available"
            details={
              <>
                <p className="govuk-body">
                  You cannot view details of screenings started at another clinic.
                </p>
                <p className="govuk-body">
                  Contact{" "}
                  <LinkLabel
                    to="mailto:uktbscreeningsupport@ukhsa.gov.uk"
                    title="uktbscreeningsupport@ukhsa.gov.uk"
                    externalLink
                  />{" "}
                  for support with these screenings.
                </p>
              </>
            }
          />
        </>
      )}

      <Table
        columnHeaders={["Start date", "Expiry date", "Status", "Action"]}
        tableRows={applicationTableInfo}
        removeRowTitleStyling
      />
    </div>
  );
};

export default ScreeningHistory;
