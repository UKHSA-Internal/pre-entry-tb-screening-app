interface ApplicantDataHeaderProps {
  applicantData: ApplicantDetailsType;
}

export default function ApplicantDataHeader(props: Readonly<ApplicantDataHeaderProps>) {
  return (
    <dl className="govuk-summary-list">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Name</dt>
        <dd className="govuk-summary-list__value">{props.applicantData.fullName}</dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date of Birth</dt>
        <dd className="govuk-summary-list__value">
          {props.applicantData.dateOfBirth.day}/{props.applicantData.dateOfBirth.month}/
          {props.applicantData.dateOfBirth.year}
        </dd>
      </div>

      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Passport Number</dt>
        <dd className="govuk-summary-list__value">{props.applicantData.passportNumber}</dd>
      </div>
    </dl>
  );
}
