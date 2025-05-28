import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postMedicalDetails } from "@/api/api";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening, setMedicalScreeningStatus } from "@/redux/medicalScreeningSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { attributeToComponentId } from "@/utils/records";

const MedicalScreeningReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const medicalData = useAppSelector(selectMedicalScreening);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await postMedicalDetails(applicationData.applicationId, {
        age: parseInt(medicalData.age),
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
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const summaryData = [
    {
      key: "Age",
      value: medicalData.age,
      link: `/medical-screening#${attributeToComponentId.age}`,
      hiddenLabel: "age",
    },
    {
      key: "Does the applicant have TB symptoms?",
      value: medicalData.tbSymptoms,
      link: `/medical-screening#${attributeToComponentId.tbSymptoms}`,
      hiddenLabel: "whether the applicant has TB symptoms",
      emptyValueText: "Enter whether the applicant has TB symptoms (optional)",
    },
    {
      key: "TB symptoms",
      value: medicalData.tbSymptomsList.join(", "),
      link: `/medical-screening#${attributeToComponentId.tbSymptomsList}`,
      hiddenLabel: "TB symptoms",
      emptyValueText: "Enter TB symptoms (optional)",
    },
    {
      key: "Other symptoms",
      value: medicalData.otherSymptomsDetail,
      link: `/medical-screening#${attributeToComponentId.otherSymptomsDetail}`,
      hiddenLabel: "other symptoms",
      emptyValueText: "Enter other symptoms (optional)",
    },
    {
      key: "Applicant history if under 11",
      value: medicalData.underElevenConditions.join(", "),
      link: `/medical-screening#${attributeToComponentId.underElevenConditions}`,
      hiddenLabel: "applicant history if under 11",
      emptyValueText: "Enter applicant history if under 11 (optional)",
    },
    {
      key: "Additional details of applicant history if under 11",
      value: medicalData.underElevenConditionsDetail,
      link: `/medical-screening#${attributeToComponentId.underElevenConditionsDetail}`,
      hiddenLabel: "additional details of applicant history if under 11",
      emptyValueText: "Enter additional details of applicant history if under 11 (optional)",
    },
    {
      key: "Has the applicant ever had tuberculosis?",
      value: medicalData.previousTb,
      link: `/medical-screening#${attributeToComponentId.previousTb}`,
      hiddenLabel: "whether the applicant has ever had tuberculosis",
      emptyValueText: "Enter whether the applicant has ever had tuberculosis (optional)",
    },
    {
      key: "Detail of applicant's previous TB",
      value: medicalData.previousTbDetail,
      link: `/medical-screening#${attributeToComponentId.previousTbDetail}`,
      hiddenLabel: "details of applicant's previous TB",
      emptyValueText: "Enter detail of applicant's previous TB (optional)",
    },
    {
      key: "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?",
      value: medicalData.closeContactWithTb,
      link: `/medical-screening#${attributeToComponentId.closeContactWithTb}`,
      hiddenLabel: "applicant's close contact with TB in the past year",
      emptyValueText:
        "Enter whether the applicant has had close contact with any person with active pulmonary tuberculosis within the past year (optional)",
    },
    {
      key: "Details of applicant's close contact with any person with active pulmonary tuberculosis",
      value: medicalData.closeContactWithTbDetail,
      link: `/medical-screening#${attributeToComponentId.closeContactWithTbDetail}`,
      hiddenLabel: "details of applicant's close contact with TB in the past year",
      emptyValueText:
        "Enter details of applicant's close contact with any person with active pulmonary tuberculosis (optional)",
    },
    {
      key: "Is the applicant pregnant?",
      value: medicalData.pregnant,
      link: `/medical-screening#${attributeToComponentId.pregnant}`,
      hiddenLabel: "pregnancy",
      emptyValueText: "Enter whether the applicant is pregnant (optional)",
    },
    {
      key: "Does the applicant have menstrual periods?",
      value: medicalData.menstrualPeriods,
      link: `/medical-screening#${attributeToComponentId.menstrualPeriods}`,
      hiddenLabel: "menstrual periods",
      emptyValueText: "Enter whether the applicant has menstrual periods (optional)",
    },
    {
      key: "Physical examination notes",
      value: medicalData.physicalExamNotes,
      link: `/medical-screening#${attributeToComponentId.physicalExamNotes}`,
      hiddenLabel: "physical examination notes",
      emptyValueText: "Enter physical examination notes (optional)",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <ApplicantDataHeader applicantData={applicantData} />

      <Summary status={medicalData.status} summaryElements={summaryData} />

      {medicalData.status == ApplicationStatus.NOT_YET_STARTED && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {medicalData.status == ApplicationStatus.COMPLETE && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default MedicalScreeningReview;
