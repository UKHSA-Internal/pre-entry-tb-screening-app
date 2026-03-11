import { ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus } from "@/utils/enums";
import { formatDateForDisplay, getCountryName } from "@/utils/helpers";

interface ApplicantDataHeaderProps {
  applicantData: ReduxApplicantDetailsType;
  applicationStatus?: ApplicationStatus;
  showCountryOfIssue: boolean;
}

export default function ApplicantDataHeader(props: Readonly<ApplicantDataHeaderProps>) {
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
        {props.showCountryOfIssue && (
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Country of issue
            </th>
            <td className="govuk-table__cell progress-tracker-header-cells">
              {getCountryName(props.applicantData.countryOfIssue)}
            </td>
          </tr>
        )}
        {props.applicationStatus && (
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              TB screening
            </th>
            <td className="govuk-table__cell progress-tracker-header-cells">
              {props.applicationStatus === ApplicationStatus.CERTIFICATE_AVAILABLE && (
                <strong className="govuk-tag govuk-tag--green">Certificate issued</strong>
              )}
              {props.applicationStatus === ApplicationStatus.CERTIFICATE_NOT_ISSUED && (
                <strong className="govuk-tag govuk-tag--red progress-tracker-task-nowrap">
                  Certificate not issued
                </strong>
              )}
              {props.applicationStatus === ApplicationStatus.CANCELLED && (
                <strong className="govuk-tag govuk-tag--orange progress-tracker-task-nowrap">
                  Screening cancelled
                </strong>
              )}
              {props.applicationStatus === ApplicationStatus.IN_PROGRESS && (
                <strong className="govuk-tag govuk-tag--yellow">In progress</strong>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
