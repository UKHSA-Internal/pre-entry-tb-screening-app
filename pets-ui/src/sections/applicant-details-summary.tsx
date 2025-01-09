import Button from '@/components/button/button';
import { ButtonType } from '@/utils/enums';
import { standardiseDayOrMonth } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { 
  selectApplicant, 
  setDob, 
  setPassportExpiryDate, 
  setPassportIssueDate, 
} from '@/redux/applicantSlice';
import { useNavigate } from 'react-router-dom';

const ApplicantReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async () => {
    // Standardise days and months of date fields
    dispatch(setDob({
      day: standardiseDayOrMonth(applicantData.dateOfBirth.day),
      month: standardiseDayOrMonth(applicantData.dateOfBirth.month),
      year: applicantData.dateOfBirth.year
    }))
    dispatch(setPassportIssueDate({
      day: standardiseDayOrMonth(applicantData.passportIssueDate.day),
      month: standardiseDayOrMonth(applicantData.passportIssueDate.month),
      year: applicantData.passportIssueDate.year
    }))
    dispatch(setPassportExpiryDate({
      day: standardiseDayOrMonth(applicantData.passportExpiryDate.day),
      month: standardiseDayOrMonth(applicantData.passportExpiryDate.month),
      year: applicantData.passportExpiryDate.year
    }))
    
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#name")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#sex")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#country-of-nationality")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#birth-date")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#passportNumber")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#country-of-issue")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#passport-issue-date")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#passport-expiry-date")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-1")}>
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
            <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-2")}>
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
            <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-3")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#town-or-city")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#province-or-state")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#address-country")}>
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
              <a className="govuk-link" style={{color: "#1d70b8"}} onClick={() => navigate("/contact#postcode")}>
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
