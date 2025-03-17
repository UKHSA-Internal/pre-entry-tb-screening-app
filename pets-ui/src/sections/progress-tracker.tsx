import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
import { ApplicationStatus, ButtonType } from "@/utils/enums";

const ProgressTracker = () => {
  const navigate = useNavigate();

  const applicantData = useAppSelector(selectApplicant);

  return (
    <div>
      <div>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Name</dt>
            <dd className="govuk-summary-list__value">{applicantData.fullName}</dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Date of birth</dt>
            <dd className="govuk-summary-list__value">
              {applicantData.dateOfBirth.day}/{applicantData.dateOfBirth.month}/
              {applicantData.dateOfBirth.year}
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Passport number</dt>
            <dd className="govuk-summary-list__value">{applicantData.passportNumber}</dd>
          </div>
        </dl>
      </div>

      <p className="govuk-body">Complete all sections.</p>

      <ul className="govuk-task-list">
        <li className="govuk-task-list__item govuk-task-list__item--with-link">
          <div className="govuk-task-list__name-and-hint">
            {applicantData.status == ApplicationStatus.INCOMPLETE && (
              <Link className="govuk-link govuk-task-list__link" to="/contact">
                Visa applicant details
              </Link>
            )}
            {applicantData.status == ApplicationStatus.COMPLETE && (
              <Link className="govuk-link govuk-task-list__link" to="/applicant-summary">
                Visa applicant details
              </Link>
            )}
          </div>
          {applicantData.status == ApplicationStatus.INCOMPLETE && (
            <div className="govuk-task-list__status">
              <strong className="govuk-tag govuk-tag--blue">Incomplete</strong>
            </div>
          )}
          {applicantData.status == ApplicationStatus.COMPLETE && (
            <div className="govuk-task-list__status">Completed</div>
          )}
        </li>
      </ul>

      <p className="govuk-body">You cannot currently log sputum test information in this system.</p>

      <Button
        id="search-again"
        type={ButtonType.DEFAULT}
        text="Search again"
        href="/applicant-search"
        handleClick={() => {
          navigate("/applicant-search");
        }}
      />
    </div>
  );
};

export default ProgressTracker;
