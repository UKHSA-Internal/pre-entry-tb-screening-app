import { DateType, ReduxApplicantDetailsType } from "@/types";
import { AdditionalStatusTagTexts, ApplicationStatus } from "@/utils/enums";
import { formatDateForDisplay, getCountryName, isDateInThePast } from "@/utils/helpers";

import StatusTag from "../statusTag/statusTag";

interface ApplicantDataHeaderProps {
  applicantData: ReduxApplicantDetailsType;
  applicationStatus?: ApplicationStatus;
  showCountryOfIssue: boolean;
  certificateExpiryDate?: DateType;
}

export default function ApplicantDataHeader(props: Readonly<ApplicantDataHeaderProps>) {
  let textOverride = undefined;
  let classOverride = undefined;
  if (
    props.applicationStatus !== ApplicationStatus.CANCELLED &&
    props.applicationStatus !== ApplicationStatus.CERTIFICATE_NOT_ISSUED &&
    props.certificateExpiryDate &&
    props.certificateExpiryDate.day.length > 0 &&
    props.certificateExpiryDate.month.length > 0 &&
    props.certificateExpiryDate.year.length > 0 &&
    isDateInThePast(
      props.certificateExpiryDate.day,
      props.certificateExpiryDate.month,
      props.certificateExpiryDate.year,
    )
  ) {
    textOverride = AdditionalStatusTagTexts.CERTIFICATE_EXPIRED;
    classOverride = "govuk-tag govuk-tag--grey";
  }

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
              <StatusTag
                id="application-status"
                status={props.applicationStatus}
                textOverride={textOverride}
                classOverride={classOverride}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
