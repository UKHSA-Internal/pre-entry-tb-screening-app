import { useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening } from "@/redux/medicalScreeningSlice";
import { ButtonType } from "@/utils/enums";

const MedicalScreeningReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const medicalData = useAppSelector(selectMedicalScreening);
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log(medicalData);
    // TO DO: post medicalData
    navigate("/medical-confirmation");
  };

  return (
    <div>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">{applicantData.fullName}</dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Age</dt>
          <dd className="govuk-summary-list__value">{medicalData.age}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#age")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> age</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Does the applicant have TB symptoms?</dt>
          <dd className="govuk-summary-list__value">{medicalData.tbSymptoms}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#tb-symptoms")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> TB symptoms</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">TB symptoms</dt>
          <dd className="govuk-summary-list__value">
            {medicalData.tbSymptomsList
              .map((symptom: string) => symptom.replace(/-/g, " "))
              .join(", ")}
          </dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#tb-symptoms-list")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> TB symptoms</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Other symptoms</dt>
          <dd className="govuk-summary-list__value">{medicalData.otherSymptomsDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#other-symptoms-detail")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> other symptoms</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Applicant history if under 11</dt>
          <dd className="govuk-summary-list__value">
            {medicalData.underElevenConditions
              .map((symptom: string) => symptom.replace(/-/g, " "))
              .join(", ")}
          </dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#under-eleven-conditions")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> applicant history if under 11</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Additional details of applicant history if under 11
          </dt>
          <dd className="govuk-summary-list__value">{medicalData.underElevenConditionsDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#under-eleven-conditions-detail")}
              href="javascript:void(0);"
            >
              Change
              <span className="govuk-visually-hidden">
                {" "}
                additional details of applicant history if under 11
              </span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Has the applicant ever had tuberculosis?</dt>
          <dd className="govuk-summary-list__value">{medicalData.previousTb}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#previous-tb")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> applicant&apos;s previous TB</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Detail of applicant&apos;s previous TB</dt>
          <dd className="govuk-summary-list__value">{medicalData.previousTbDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#previous-tb-detail")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> applicant&apos;s previous TB</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Has the applicant had close contact with any person with active pulmonary tuberculosis
            within the past year?
          </dt>
          <dd className="govuk-summary-list__value">{medicalData.closeContactWithTb}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#close-contact-with-tb")}
              href="javascript:void(0);"
            >
              Change
              <span className="govuk-visually-hidden">
                {" "}
                applicant&apos;s close contact with TB in the past year
              </span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Details of applicant&apos;s close contact with any person with active pulmonary
            tuberculosis
          </dt>
          <dd className="govuk-summary-list__value">{medicalData.closeContactWithTbDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#close-contact-with-tb-detail")}
              href="javascript:void(0);"
            >
              Change
              <span className="govuk-visually-hidden">
                {" "}
                details of applicant&apos;s close contact with TB in the past year
              </span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Is the applicant pregnant?</dt>
          <dd className="govuk-summary-list__value">{medicalData.pregnant}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#pregnant")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> pregnancy</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Does the applicant have menstrual periods?</dt>
          <dd className="govuk-summary-list__value">{medicalData.menstrualPeriods}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#menstrual-periods")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> menstrual periods</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Physical examination notes</dt>
          <dd className="govuk-summary-list__value">{medicalData.physicalExamNotes}</dd>
          <dd className="govuk-summary-list__actions">
            <a
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              onClick={() => navigate("/medical-screening#physical-exam-notes")}
              href="javascript:void(0);"
            >
              Change<span className="govuk-visually-hidden"> physical examination notes</span>
            </a>
          </dd>
        </div>
      </dl>
      <Button
        id="confirm"
        type={ButtonType.DEFAULT}
        text="Confirm"
        href="/medical-confirmation"
        handleClick={handleSubmit}
      />
    </div>
  );
};

export default MedicalScreeningReview;
