import React from "react";

import { ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus } from "@/utils/enums";
import { formatDateForDisplay } from "@/utils/helpers";

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
    <table className="govuk-table">
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Name
          </th>
          <td className="govuk-table__cell progress-tracker-header-cells">
            {props.applicantData.fullName}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Date of birth
          </th>
          <td className="govuk-table__cell progress-tracker-header-cells">
            {formatDateForDisplay(props.applicantData.dateOfBirth)}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Passport number
          </th>
          <td className="govuk-table__cell progress-tracker-header-cells">
            {props.applicantData.passportNumber}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            TB screening
          </th>
          <td className="govuk-table__cell progress-tracker-header-cells">
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
            {(props.applicationStatus === ApplicationStatus.IN_PROGRESS ||
              props.applicationStatus === ApplicationStatus.NULL) && (
              <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
