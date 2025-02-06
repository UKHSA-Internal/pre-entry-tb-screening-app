import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/utils/enums";

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
            <dt className="govuk-summary-list__key">Date of Birth</dt>
            <dd className="govuk-summary-list__value">
              {applicantData.dateOfBirth.day}/{applicantData.dateOfBirth.month}/
              {applicantData.dateOfBirth.year}
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Passport Number</dt>
            <dd className="govuk-summary-list__value">{applicantData.passportNumber}</dd>
          </div>
        </dl>
      </div>

      <ul className="govuk-task-list">
        <li className="govuk-task-list__item govuk-task-list__item--with-link">
          <div className="govuk-task-list__name-and-hint">
            <a
              className="govuk-link govuk-task-list__link"
              href="/contact"
              onClick={() => navigate("/contact")}
            >
              Applicant Details
            </a>
          </div>
          <div className="govuk-task-list__status">Completed</div>
        </li>
        <li className="govuk-task-list__item govuk-task-list__item--with-link">
          <div className="govuk-task-list__name-and-hint">
            <a
              className="govuk-link govuk-task-list__link"
              href="/contact"
              onClick={() => navigate("/contact")}
            >
              Styling for incomplete
            </a>
          </div>
          <div className="govuk-task-list__status">
            <strong className="govuk-tag govuk-tag--blue">Incomplete</strong>
          </div>
        </li>
      </ul>

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
