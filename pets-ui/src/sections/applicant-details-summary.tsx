import Button from '@/components/button/button';
import { ButtonType } from '@/utils/enums';
import { useAppSelector } from '@/redux/hooks'
import { selectApplicant } from '@/redux/applicantSlice';
import { useNavigate } from 'react-router-dom';

const ApplicantReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch("http://localhost:3005/dev/register-applicant", {
          method: "POST",
          body: JSON.stringify(applicantData),
          headers: myHeaders,
      })
      navigate("/applicant-confirmation")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting POST request:")
        console.error(error?.message);
      } else {
        console.error("Error submitting POST request: unknown error type")
        console.error(error);
      }
    }
  }

  return(
      <div>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Name
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.fullName}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#name")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> name</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Sex
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.sex}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#sex")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> sex</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Country of Nationality
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.countryOfNationality}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#country-of-nationality")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> country of nationality</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Date of Birth
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.dateOfBirth.day}-{applicantData.dateOfBirth.month}-{applicantData.dateOfBirth.year}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#birth-date")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> date of birth</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Passport number
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.passportNumber}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#passportNumber")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> passport number</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Country of Issue
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.countryOfIssue}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#country-of-issue")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> country of issue</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Passport Issue Date
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.passportIssueDate.day}-{applicantData.passportIssueDate.month}-{applicantData.passportIssueDate.year}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#passport-issue-date")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> passport issue date</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Passport Expiry Date
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.passportExpiryDate.day}-{applicantData.passportExpiryDate.month}-{applicantData.passportExpiryDate.year}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#passport-expiry-date")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> passport expiry date</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Home Address Line 1
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.applicantHomeAddress1}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-1")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> home address line 1</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Home Address Line 2
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.applicantHomeAddress2}
            </dd>
            <dd className="govuk-summary-list__actions">
            <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-2")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> home address line 2</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Home Address Line 3
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.applicantHomeAddress3}
            </dd>
            <dd className="govuk-summary-list__actions">
            <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-3")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> home address line 3</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Town or City
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.townOrCity}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#town-or-city")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> home town or city</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Province or State
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.provinceOrState}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#province-or-state")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> home province or state</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Country
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.country}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-country")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> country</span>
              </a>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Postcode
            </dt>
            <dd className="govuk-summary-list__value">
              {applicantData.postcode}
            </dd>
            <dd className="govuk-summary-list__actions">
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#postcode")} href="javascript:void(0);">
                Change<span className="govuk-visually-hidden"> postcode</span>
              </a>
            </dd>
          </div>
        </dl>
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Confirm"
          href="/applicant-confirmation"
          handleClick={handleSubmit}/>
      </div>
  )
}

export default ApplicantReview;
