import React from "react";

import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { useAppSelector } from "@/redux/hooks";
import {
  selectApplicant,
  selectChestXray,
  selectMedicalScreening,
  selectSputum,
  selectTbCertificate,
  selectTravel,
} from "@/redux/store";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";

interface TaskProps {
  description: string;
  status: ApplicationStatus;
  linkWhenIncomplete: string;
  linkWhenComplete: string;
  prerequisiteTaskStatuses: ApplicationStatus[];
  statusOverride?: React.ReactNode;
}

const Task = (props: Readonly<TaskProps>) => {
  const allPrerequisitesComplete =
    props.prerequisiteTaskStatuses.length < 1 ||
    props.prerequisiteTaskStatuses.every(
      (status) =>
        status == ApplicationStatus.COMPLETE ||
        status == ApplicationStatus.NOT_REQUIRED ||
        status == ApplicationStatus.CERTIFICATE_ISSUED ||
        status == ApplicationStatus.CERTIFICATE_NOT_ISSUED,
    );

  return (
    <li className="govuk-task-list__item govuk-task-list__item--with-link">
      <div className="govuk-task-list__name-and-hint">
        {allPrerequisitesComplete &&
          (props.status == ApplicationStatus.NOT_YET_STARTED ||
            props.status == ApplicationStatus.IN_PROGRESS) && (
            <LinkLabel
              className="govuk-link govuk-task-list__link"
              to={props.linkWhenIncomplete}
              title={props.description}
              externalLink={false}
            />
          )}
        {props.status == ApplicationStatus.COMPLETE && (
          <LinkLabel
            className="govuk-link govuk-task-list__link"
            to={props.linkWhenComplete}
            title={props.description}
            externalLink={false}
          />
        )}
        {(!allPrerequisitesComplete || props.status == ApplicationStatus.NOT_REQUIRED) &&
          props.status !== ApplicationStatus.COMPLETE && (
            <p className="govuk-body task-description-static">{props.description}</p>
          )}
      </div>
      {props.status == ApplicationStatus.NOT_YET_STARTED && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--blue">Not yet started</strong>
        </div>
      )}
      {props.status == ApplicationStatus.IN_PROGRESS && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
        </div>
      )}
      {props.status == ApplicationStatus.COMPLETE && (
        <div className="govuk-task-list__status">
          {props.statusOverride ?? (
            <strong className="govuk-tag govuk-tag--green">Completed</strong>
          )}
        </div>
      )}
      {props.status == ApplicationStatus.NOT_REQUIRED && (
        <div className="govuk-task-list__status">
          <strong className="govuk-tag govuk-tag--grey">Not required</strong>
        </div>
      )}
    </li>
  );
};

const ProgressTracker = () => {
  const applicantData = useAppSelector(selectApplicant);
  const travelData = useAppSelector(selectTravel);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const chestXrayData = useAppSelector(selectChestXray);
  const sputumData = useAppSelector(selectSputum);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const applicantPhotoContext = useApplicantPhoto();

  const allSputumSamplesSubmitted =
    sputumData.sample1.collection.submittedToDatabase &&
    sputumData.sample2.collection.submittedToDatabase &&
    sputumData.sample3.collection.submittedToDatabase;

  let sputumLink = "/sputum-collection";

  if (sputumData.status === ApplicationStatus.COMPLETE) {
    sputumLink = "/check-sputum-sample-information";
  } else if (allSputumSamplesSubmitted) {
    sputumLink = "/enter-sputum-sample-results";
  }

  let tbCertificateStatusOverride = undefined;
  if (tbCertificateData.status === ApplicationStatus.COMPLETE) {
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
      <div className="progress-tracker-header">
        <div className="progress-tracker-header-content">
          <ApplicantDataHeader
            applicantData={applicantData}
            tbCertificateStatus={tbCertificateData.status}
            tbCertificateIsIssued={tbCertificateData.isIssued}
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

      <h2 className="govuk-heading-s">1. Visa applicant information</h2>
      <ul className="govuk-task-list">
        <Task
          description="Visa applicant details"
          status={applicantData.status}
          linkWhenIncomplete="/contact"
          linkWhenComplete="/applicant-summary"
          prerequisiteTaskStatuses={[]}
        />
        <Task
          description="Travel information"
          status={travelData.status}
          linkWhenIncomplete="/travel-details"
          linkWhenComplete="/travel-summary"
          prerequisiteTaskStatuses={[applicantData.status]}
        />
      </ul>

      <h2 className="govuk-heading-s">2. Medical screening</h2>
      <ul className="govuk-task-list">
        <Task
          description="Medical history and TB symptoms"
          status={medicalScreeningData.status}
          linkWhenIncomplete="/medical-screening"
          linkWhenComplete="/medical-summary"
          prerequisiteTaskStatuses={[applicantData.status, travelData.status]}
        />
        <Task
          description="Radiological outcome"
          status={chestXrayData.status}
          linkWhenIncomplete="/chest-xray-question"
          linkWhenComplete="/chest-xray-summary"
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
          ]}
        />
        <Task
          description="Sputum collection and results"
          status={sputumData.status}
          linkWhenIncomplete={sputumLink}
          linkWhenComplete={sputumLink}
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
            chestXrayData.status,
          ]}
        />
      </ul>

      <h2 className="govuk-heading-s">3. Review outcome</h2>
      <ul className="govuk-task-list">
        <Task
          description="TB certificate outcome"
          status={tbCertificateData.status}
          linkWhenIncomplete="/tb-certificate-question"
          linkWhenComplete="/tb-certificate-confirmation"
          prerequisiteTaskStatuses={[
            applicantData.status,
            travelData.status,
            medicalScreeningData.status,
            chestXrayData.status,
            sputumData.status,
          ]}
          statusOverride={tbCertificateStatusOverride}
        />
      </ul>

      <h2 className="govuk-heading-s progress-tracker-start-search">Start a new search</h2>
      <p className="govuk-body">
        <LinkLabel
          className="govuk-link"
          to="/applicant-search"
          title="Search for another visa applicant"
          externalLink={false}
        />
      </p>
    </div>
  );
};

export default ProgressTracker;
