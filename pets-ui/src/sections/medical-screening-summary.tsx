import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/button/button";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening, setMedicalScreeningStatus } from "@/redux/medicalScreeningSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";

const MedicalScreeningReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const medicalData = useAppSelector(selectMedicalScreening);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/application/${applicationData.applicationId}/medical-screening`, {
        age: medicalData.age,
        symptomsOfTb: medicalData.tbSymptoms,
        symptoms: medicalData.tbSymptomsList,
        symptomsOther: medicalData.otherSymptomsDetail,
        historyOfConditionsUnder11: medicalData.underElevenConditions,
        historyOfConditionsUnder11Details: medicalData.underElevenConditionsDetail,
        historyOfPreviousTb: medicalData.previousTb,
        previousTbDetails: medicalData.previousTbDetail,
        contactWithPersonWithTb: medicalData.closeContactWithTb,
        contactWithTbDetails: medicalData.closeContactWithTbDetail,
        pregnant: medicalData.pregnant,
        haveMenstralPeriod: medicalData.menstrualPeriods,
        physicalExaminationNotes: medicalData.physicalExamNotes,
      });

      dispatch(setMedicalScreeningStatus(ApplicationStatus.COMPLETE));
      navigate("/medical-confirmation");
    } catch {
      navigate("/error");
    }
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
            <Link className="govuk-link" style={{ color: "#1d70b8" }} to="/medical-screening#age">
              Change<span className="govuk-visually-hidden"> age</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Does the applicant have TB symptoms?</dt>
          <dd className="govuk-summary-list__value">{medicalData.tbSymptoms}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#tb-symptoms"
            >
              Change<span className="govuk-visually-hidden"> TB symptoms</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">TB symptoms</dt>
          <dd className="govuk-summary-list__value">{medicalData.tbSymptomsList.join(", ")}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#tb-symptoms-list"
            >
              Change<span className="govuk-visually-hidden"> TB symptoms</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Other symptoms</dt>
          <dd className="govuk-summary-list__value">{medicalData.otherSymptomsDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#other-symptoms-detail"
            >
              Change<span className="govuk-visually-hidden"> other symptoms</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Applicant history if under 11</dt>
          <dd className="govuk-summary-list__value">
            {medicalData.underElevenConditions.join(", ")}
          </dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#under-eleven-conditions"
            >
              Change<span className="govuk-visually-hidden"> applicant history if under 11</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Additional details of applicant history if under 11
          </dt>
          <dd className="govuk-summary-list__value">{medicalData.underElevenConditionsDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#under-eleven-conditions-detail"
            >
              Change{" "}
              <span className="govuk-visually-hidden">
                additional details of applicant history if under 11
              </span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Has the applicant ever had tuberculosis?</dt>
          <dd className="govuk-summary-list__value">{medicalData.previousTb}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#previous-tb"
            >
              Change<span className="govuk-visually-hidden"> applicant&apos;s previous TB</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Detail of applicant&apos;s previous TB</dt>
          <dd className="govuk-summary-list__value">{medicalData.previousTbDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#previous-tb-detail"
            >
              Change<span className="govuk-visually-hidden"> applicant&apos;s previous TB</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Has the applicant had close contact with any person with active pulmonary tuberculosis
            within the past year?
          </dt>
          <dd className="govuk-summary-list__value">{medicalData.closeContactWithTb}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#close-contact-with-tb"
            >
              Change{" "}
              <span className="govuk-visually-hidden">
                applicant&apos;s close contact with TB in the past year
              </span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            Details of applicant&apos;s close contact with any person with active pulmonary
            tuberculosis
          </dt>
          <dd className="govuk-summary-list__value">{medicalData.closeContactWithTbDetail}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#close-contact-with-tb-detail"
            >
              Change{" "}
              <span className="govuk-visually-hidden">
                details of applicant&apos;s close contact with TB in the past year
              </span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Is the applicant pregnant?</dt>
          <dd className="govuk-summary-list__value">{medicalData.pregnant}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#pregnant"
            >
              Change<span className="govuk-visually-hidden"> pregnancy</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Does the applicant have menstrual periods?</dt>
          <dd className="govuk-summary-list__value">{medicalData.menstrualPeriods}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#menstrual-periods"
            >
              Change<span className="govuk-visually-hidden"> menstrual periods</span>
            </Link>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Physical examination notes</dt>
          <dd className="govuk-summary-list__value">{medicalData.physicalExamNotes}</dd>
          <dd className="govuk-summary-list__actions">
            <Link
              className="govuk-link"
              style={{ color: "#1d70b8" }}
              to="/medical-screening#physical-exam-notes"
            >
              Change<span className="govuk-visually-hidden"> physical examination notes</span>
            </Link>
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
