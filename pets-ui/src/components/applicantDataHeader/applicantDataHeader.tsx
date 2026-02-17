import React from "react";

import { ReduxApplicantDetailsType } from "@/types";
import { TaskStatus, YesOrNo } from "@/utils/enums";

interface ApplicantDataHeaderProps {
  applicantData: ReduxApplicantDetailsType;
  tbCertificateStatus: TaskStatus;
  tbCertificateIsIssued: YesOrNo;
}

export default function ApplicantDataHeader(props: Readonly<ApplicantDataHeaderProps>) {
  let overallTbScreeningStatus: TaskStatus;

  if (
    props.tbCertificateStatus === TaskStatus.COMPLETE &&
    props.tbCertificateIsIssued === YesOrNo.YES
  ) {
    overallTbScreeningStatus = TaskStatus.CERTIFICATE_ISSUED;
  } else if (
    props.tbCertificateStatus === TaskStatus.COMPLETE &&
    props.tbCertificateIsIssued === YesOrNo.NO
  ) {
    overallTbScreeningStatus = TaskStatus.CERTIFICATE_NOT_ISSUED;
  } else {
    overallTbScreeningStatus = TaskStatus.IN_PROGRESS;
  }

  const certificateNotIssuedStyle: React.CSSProperties = {
    maxWidth: "none",
    whiteSpace: "nowrap",
  };

  return (
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Name</dt>
        <dd className="govuk-summary-list__value">{props.applicantData.fullName}</dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date of birth</dt>
        <dd className="govuk-summary-list__value">
          {props.applicantData.dateOfBirth.day}/{props.applicantData.dateOfBirth.month}/
          {props.applicantData.dateOfBirth.year}
        </dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Passport number</dt>
        <dd className="govuk-summary-list__value">{props.applicantData.passportNumber}</dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">TB screening</dt>
        <dd className="govuk-summary-list__value">
          {overallTbScreeningStatus === TaskStatus.CERTIFICATE_ISSUED && (
            <strong className="govuk-tag govuk-tag--green">Certificate issued</strong>
          )}
          {overallTbScreeningStatus === TaskStatus.CERTIFICATE_NOT_ISSUED && (
            <strong className="govuk-tag govuk-tag--red" style={certificateNotIssuedStyle}>
              Certificate not issued
            </strong>
          )}
          {overallTbScreeningStatus === TaskStatus.IN_PROGRESS && (
            <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
          )}
        </dd>
      </div>
    </dl>
  );
}
