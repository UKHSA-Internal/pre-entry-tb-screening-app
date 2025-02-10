import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { selectApplicant, setApplicantDetailsStatus } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
import { ApplicationStatus, ButtonType } from "@/utils/enums";

const ApplicantReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // await fetch("http://localhost:3005/applicant/register", {
    //   method: "POST",
    //   body: JSON.stringify(applicantData),
    //   headers: myHeaders,
    // });
    dispatch(setApplicantDetailsStatus(ApplicationStatus.COMPLETE));
    navigate("/applicant-confirmation");
  };

  return (
    <div>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">{applicantData.fullName}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#name">
                Change<span className="govuk-visually-hidden"> name</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Sex</dt>
          <dd className="govuk-summary-list__value">{applicantData.sex}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#sex">
                Change<span className="govuk-visually-hidden"> sex</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Country of Nationality</dt>
          <dd className="govuk-summary-list__value">{applicantData.countryOfNationality}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                to="/contact#country-of-nationality"
              >
                Change<span className="govuk-visually-hidden"> country of nationality</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Date of Birth</dt>
          <dd className="govuk-summary-list__value">
            {applicantData.dateOfBirth.day}/{applicantData.dateOfBirth.month}/
            {applicantData.dateOfBirth.year}
          </dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#birth-date">
                Change<span className="govuk-visually-hidden"> date of birth</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Passport number</dt>
          <dd className="govuk-summary-list__value">{applicantData.passportNumber}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                to="/contact#passportNumber"
              >
                Change<span className="govuk-visually-hidden"> passport number</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Country of Issue</dt>
          <dd className="govuk-summary-list__value">{applicantData.countryOfIssue}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                to="/contact#country-of-issue"
              >
                Change<span className="govuk-visually-hidden"> country of issue</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Passport Issue Date</dt>
          <dd className="govuk-summary-list__value">
            {applicantData.passportIssueDate.day}/{applicantData.passportIssueDate.month}/
            {applicantData.passportIssueDate.year}
          </dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                to="/contact#passport-issue-date"
              >
                Change<span className="govuk-visually-hidden"> passport issue date</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Passport Expiry Date</dt>
          <dd className="govuk-summary-list__value">
            {applicantData.passportExpiryDate.day}/{applicantData.passportExpiryDate.month}/
            {applicantData.passportExpiryDate.year}
          </dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                to="/contact#passport-expiry-date"
              >
                Change<span className="govuk-visually-hidden"> passport expiry date</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Home Address Line 1</dt>
          <dd className="govuk-summary-list__value">{applicantData.applicantHomeAddress1}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#address-1">
                Change<span className="govuk-visually-hidden"> home address line 1</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Home Address Line 2</dt>
          <dd className="govuk-summary-list__value">{applicantData.applicantHomeAddress2}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#address-2">
                Change<span className="govuk-visually-hidden"> home address line 2</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Home Address Line 3</dt>
          <dd className="govuk-summary-list__value">{applicantData.applicantHomeAddress3}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#address-3">
                Change<span className="govuk-visually-hidden"> home address line 3</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Town or City</dt>
          <dd className="govuk-summary-list__value">{applicantData.townOrCity}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#town-or-city">
                Change<span className="govuk-visually-hidden"> home town or city</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Province or State</dt>
          <dd className="govuk-summary-list__value">{applicantData.provinceOrState}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                onClick={() => navigate("")}
                to="/contact#province-or-state"
              >
                Change<span className="govuk-visually-hidden"> home province or state</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Country</dt>
          <dd className="govuk-summary-list__value">{applicantData.country}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link
                className="govuk-link"
                style={{ color: "#1d70b8" }}
                to="/contact#address-country"
              >
                Change<span className="govuk-visually-hidden"> country</span>
              </Link>
            </dd>
          )}
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Postcode</dt>
          <dd className="govuk-summary-list__value">{applicantData.postcode}</dd>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/contact#postcode">
                Change<span className="govuk-visually-hidden"> postcode</span>
              </Link>
            </dd>
          )}
        </div>
      </dl>
      {applicantData.status == ApplicationStatus.INCOMPLETE && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Confirm"
          href="/applicant-confirmation"
          handleClick={handleSubmit}
        />
      )}
      {applicantData.status == ApplicationStatus.COMPLETE && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to Tracker"
          href="/tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default ApplicantReview;
