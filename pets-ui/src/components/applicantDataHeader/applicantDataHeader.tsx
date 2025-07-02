import React from "react";

import { ReduxApplicantDetailsType } from "@/applicant";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";

interface ApplicantDataHeaderProps {
  applicantData: ReduxApplicantDetailsType;
  tbCertificateStatus: ApplicationStatus;
  tbCertificateIsIssued: YesOrNo;
}

export default function ApplicantDataHeader(props: Readonly<ApplicantDataHeaderProps>) {
  const getOverallTbScreeningStatus = () => {
    if (props.tbCertificateStatus === ApplicationStatus.COMPLETE) {
      if (props.tbCertificateIsIssued === YesOrNo.YES) {
        return "Certificate issued";
      } else if (props.tbCertificateIsIssued === YesOrNo.NO) {
        return "Certificate not issued";
      }
    }
    return "In progress";
  };

  const overallTbScreeningStatus = getOverallTbScreeningStatus();

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
          {overallTbScreeningStatus === "Certificate issued" && (
            <strong className="govuk-tag govuk-tag--green">Certificate issued</strong>
          )}
          {overallTbScreeningStatus === "Certificate not issued" && (
            <strong className="govuk-tag govuk-tag--red" style={certificateNotIssuedStyle}>
              Certificate not issued
            </strong>
          )}
          {overallTbScreeningStatus === "In progress" && (
            <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
          )}
        </dd>
      </div>
    </dl>
  );
}
