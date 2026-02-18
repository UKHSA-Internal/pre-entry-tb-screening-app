import React from "react";

import { ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus } from "@/utils/enums";

interface ApplicantDataHeaderProps {
  applicantData: ReduxApplicantDetailsType;
  applicationStatus: ApplicationStatus;
}

export default function ApplicantDataHeader(props: Readonly<ApplicantDataHeaderProps>) {
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
          {props.applicationStatus === ApplicationStatus.CERTIFICATE_AVAILABLE && (
            <strong className="govuk-tag govuk-tag--green">Certificate issued</strong>
          )}
          {props.applicationStatus === ApplicationStatus.CERTIFICATE_NOT_ISSUED && (
            <strong className="govuk-tag govuk-tag--red" style={certificateNotIssuedStyle}>
              Certificate not issued
            </strong>
          )}
          {props.applicationStatus === ApplicationStatus.CANCELLED && (
            <strong className="govuk-tag govuk-tag--orange" style={certificateNotIssuedStyle}>
              Screening cancelled
            </strong>
          )}
          {props.applicationStatus === ApplicationStatus.IN_PROGRESS ||
            (props.applicationStatus === ApplicationStatus.NULL && (
              <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
            ))}
        </dd>
      </div>
    </dl>
  );
}
