import React from "react";
import { useNavigate } from "react-router";

import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import NotificationBanner from "@/components/notificationBanner/notificationBanner";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { useAppSelector } from "@/redux/hooks";
import {
  selectApplicant,
  selectApplication,
  selectChestXray,
  selectMedicalScreening,
  selectRadiologicalOutcome,
  selectSputum,
  selectSputumDecision,
  selectTbCertificate,
  selectTravel,
} from "@/redux/store";
import { ApplicationStatus, ButtonClass, TaskStatus, YesOrNo } from "@/utils/enums";
import { formatDateForDisplay } from "@/utils/helpers";

interface TaskProps {
  description: string;
  status: TaskStatus;
  linkWhenIncomplete: string;
  linkWhenComplete: string;
  prerequisiteTaskStatuses: TaskStatus[];
  statusOverride?: React.ReactNode;
}

const Task = (props: Readonly<TaskProps>) => {
  const allPrerequisitesComplete =
    props.prerequisiteTaskStatuses.length < 1 ||
    props.prerequisiteTaskStatuses.every(
      (status) =>
        status == TaskStatus.COMPLETE ||
        status == TaskStatus.NOT_REQUIRED ||
        status == TaskStatus.CERTIFICATE_ISSUED ||
        status == TaskStatus.CERTIFICATE_NOT_ISSUED,
    );

  return (
    <li className="govuk-task-list__item govuk-task-list__item--with-link">
      <div className="govuk-task-list__name-and-hint">
        {allPrerequisitesComplete &&
          (props.status == TaskStatus.NOT_YET_STARTED ||
            props.status == TaskStatus.IN_PROGRESS) && (
            <LinkLabel
              className="govuk-link govuk-task-list__link"
              to={props.linkWhenIncomplete}
              title={props.description}
              externalLink={false}
            />
          )}
        {props.status == TaskStatus.COMPLETE && (
          <LinkLabel
            className="govuk-link govuk-task-list__link"
            to={props.linkWhenComplete}
            title={props.description}
            externalLink={false}
          />
        )}
        {(!allPrerequisitesComplete || props.status == TaskStatus.NOT_REQUIRED) &&
          props.status !== TaskStatus.COMPLETE && (
            <p className="govuk-body task-description-static">{props.description}</p>
          )}
      </div>
      {allPrerequisitesComplete && props.status == TaskStatus.NOT_YET_STARTED && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--blue">Not yet started</strong>
        </div>
      )}
      {!allPrerequisitesComplete && props.status == TaskStatus.NOT_YET_STARTED && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--grey">Cannot start yet</strong>
        </div>
      )}
      {props.status == TaskStatus.IN_PROGRESS && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
        </div>
      )}
      {props.status == TaskStatus.COMPLETE && (
        <div className="govuk-task-list__status">{props.statusOverride ?? <>Completed</>}</div>
      )}
      {props.status == TaskStatus.NOT_REQUIRED && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--grey">Not required</strong>
        </div>
      )}
    </li>
  );
};

const ProgressTracker = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const chestXrayData = useAppSelector(selectChestXray);
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);
  const sputumDecisionData = useAppSelector(selectSputumDecision);
  const sputumData = useAppSelector(selectSputum);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const applicantPhotoContext = useApplicantPhoto();
  const navigate = useNavigate();

  const isApplicationCancelled = applicationData.applicationStatus == ApplicationStatus.CANCELLED;

  const allSputumSamplesSubmitted =
    sputumData.sample1.collection.submittedToDatabase &&
    sputumData.sample2.collection.submittedToDatabase &&
    sputumData.sample3.collection.submittedToDatabase;

  let sputumLink = "/sputum-collection-details";

  if (sputumData.status === TaskStatus.COMPLETE) {
    sputumLink = "/check-sputum-collection-details-results";
  } else if (allSputumSamplesSubmitted) {
    sputumLink = "/sputum-results";
  }

  let sputumCollectionStatus = sputumData.status;
  if (sputumDecisionData.isSputumRequired === YesOrNo.NO) {
    sputumCollectionStatus = TaskStatus.NOT_REQUIRED;
  }

  let chestXrayStatus = chestXrayData.status;
  let radiologicalOutcomeStatus = radiologicalOutcomeData.status;

  if (medicalScreeningData.chestXrayTaken === YesOrNo.NO) {
    chestXrayStatus = TaskStatus.NOT_REQUIRED;
    radiologicalOutcomeStatus = TaskStatus.NOT_REQUIRED;
  }

  let tbCertificateStatusOverride = undefined;
  if (tbCertificateData.status === TaskStatus.COMPLETE) {
    if (tbCertificateData.isIssued === YesOrNo.YES) {
      tbCertificateStatusOverride = (
        <strong className="govuk-tag govuk-tag--green">Certificate issued</strong>
      );
    } else {
      tbCertificateStatusOverride = (
        <strong className="govuk-tag govuk-tag--red progress-tracker-certificate-not-issued">
          Certificate not issued
        </strong>
      );
    }
  }

  return (
    <div>
      {isApplicationCancelled && (
        <NotificationBanner
          bannerTitle="Important"
          bannerHeading={`Start date: ${formatDateForDisplay(applicationData.dateCreated)}`}
        >
          <p className="govuk-body">
            This screening was cancelled because {applicationData.cancellationReason}
          </p>
          {applicationData.cancellationFurtherInfo && (
            <p className="govuk-body">
              <strong>Further information</strong>
              <br />
              {applicationData.cancellationFurtherInfo}
            </p>
          )}
          <LinkLabel
            title="Return to screening history for this visa applicant"
            to="/screening-history"
            externalLink={false}
          />
        </NotificationBanner>
      )}

      <div className="progress-tracker-header">
        <div className="progress-tracker-header-content">
          <ApplicantDataHeader
            applicantData={applicantData}
            applicationStatus={applicationData.applicationStatus}
          />
        </div>
        {applicantPhotoContext?.applicantPhotoDataUrl && (
          <div className="progress-tracker-photo-container">
            <img
              src={applicantPhotoContext.applicantPhotoDataUrl}
              alt={"Applicant"}
              title={applicantData.applicantPhotoFileName ?? undefined}
              className="progress-tracker-photo"
            />
          </div>
        )}
      </div>

      <Heading title="1. Visa applicant information" level={2} size="s" />
      <ul className="govuk-task-list">
        <Task
          description="Visa applicant details"
          status={applicantData.status}
          linkWhenIncomplete="/visa-applicant-personal-information"
          linkWhenComplete="/check-visa-applicant-details"
          prerequisiteTaskStatuses={[]}
        />
        <Task
          description="UK travel information"
          status={travelData.status}
          linkWhenIncomplete="/proposed-visa-category"
          linkWhenComplete="/check-travel-information"
          prerequisiteTaskStatuses={[applicantData.status]}
        />
      </ul>

      <Heading title="2. Medical screening" level={2} size="s" />
      <ul className="govuk-task-list">
        <Task
          description="Medical history and TB symptoms"
          status={medicalScreeningData.status}
          linkWhenIncomplete="/record-medical-history-tb-symptoms"
          linkWhenComplete="/check-medical-history-and-tb-symptoms"
          prerequisiteTaskStatuses={[applicantData.status, travelData.status]}
        />
        <Task
          description="Upload chest X-ray images"
          status={chestXrayStatus}
          linkWhenIncomplete="/upload-chest-x-ray-images"
          linkWhenComplete="/check-chest-x-ray-images"
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
          ]}
        />
        <Task
          description="Radiological outcome"
          status={radiologicalOutcomeStatus}
          linkWhenIncomplete="/chest-x-ray-results"
          linkWhenComplete="/check-chest-x-ray-results-findings"
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
            chestXrayStatus,
          ]}
        />
        <Task
          description="Make a sputum decision"
          status={sputumDecisionData.status}
          linkWhenIncomplete="/is-sputum-collection-required"
          linkWhenComplete="/check-sputum-decision-information"
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
            chestXrayStatus,
            radiologicalOutcomeStatus,
          ]}
        />
        <Task
          description="Sputum collection and results"
          status={sputumCollectionStatus}
          linkWhenIncomplete={sputumLink}
          linkWhenComplete={sputumLink}
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
            chestXrayStatus,
            radiologicalOutcomeStatus,
            sputumDecisionData.status,
          ]}
        />
      </ul>

      <Heading title="3. Review outcome" level={2} size="s" />
      <ul className="govuk-task-list">
        <Task
          description="TB certificate outcome"
          status={tbCertificateData.status}
          linkWhenIncomplete="/will-you-issue-tb-clearance-certificate"
          linkWhenComplete="/tb-screening-complete"
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
            chestXrayStatus,
            radiologicalOutcomeStatus,
            sputumDecisionData.status,
            sputumCollectionStatus,
          ]}
          statusOverride={tbCertificateStatusOverride}
        />
      </ul>

      <Heading
        title="View screening history"
        level={2}
        size="s"
        additionalClasses="progress-tracker-lower-headings"
      />
      <p className="govuk-body">
        <LinkLabel
          className="govuk-link"
          to="/screening-history"
          title="View the screening history for this visa applicant"
          externalLink={false}
        />
      </p>

      {!isApplicationCancelled &&
        (tbCertificateData.status == TaskStatus.NOT_YET_STARTED ||
          tbCertificateData.status == TaskStatus.IN_PROGRESS) && (
          <>
            <Heading
              title="Cancel screening"
              level={2}
              size="s"
              additionalClasses="progress-tracker-lower-headings"
            />
            <Button
              id="cancel-screening"
              class={ButtonClass.WARNING}
              text="Cancel this screening"
              handleClick={() => {
                navigate("/why-are-you-cancelling-this-screening");
              }}
              style={{ marginTop: 0 }}
            />
          </>
        )}

      <Heading
        title="Start a new search"
        level={2}
        size="s"
        additionalClasses="progress-tracker-lower-headings"
      />
      <p className="govuk-body">
        <LinkLabel
          className="govuk-link"
          to="/search-for-visa-applicant"
          title="Search for another visa applicant"
          externalLink={false}
        />
      </p>
    </div>
  );
};

export default ProgressTracker;
