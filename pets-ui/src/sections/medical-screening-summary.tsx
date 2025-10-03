import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postMedicalDetails } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { setMedicalScreeningStatus } from "@/redux/medicalScreeningSlice";
import { selectApplication, selectMedicalScreening } from "@/redux/store";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import { formatDateForDisplay } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const MedicalScreeningReview = () => {
  const applicationData = useAppSelector(selectApplication);
  const medicalData = useAppSelector(selectMedicalScreening);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const mapBackendToDisplay = (backendValue: string): string => {
    if (backendValue === "Child") return "Child (under 11 years)";
    if (backendValue === "Pregnant") return "Pregnant";
    return backendValue;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const originalReason = medicalData.reasonXrayNotRequired;
      await postMedicalDetails(applicationData.applicationId, {
        dateOfMedicalScreening:
          medicalData.completionDate.year &&
          medicalData.completionDate.month &&
          medicalData.completionDate.day
            ? `${medicalData.completionDate.year}-${medicalData.completionDate.month.padStart(2, "0")}-${medicalData.completionDate.day.padStart(2, "0")}`
            : new Date().toISOString().split("T")[0],
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
        isXrayRequired: medicalData.chestXrayTaken || YesOrNo.NULL,
        reasonXrayNotRequired: originalReason,
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
      key: "Date of medical screening",
      value: formatDateForDisplay(medicalData.completionDate) || "Not provided",
      link: `/medical-screening#medical-screening-completion-date`,
      hiddenLabel: "date of medical screening",
      emptyValueText: "Enter date of medical screening",
    },
    {
      key: "Age",
      value: medicalData.age || "Not provided",
      link: `/medical-screening#${attributeToComponentId.age}`,
      hiddenLabel: "age",
      emptyValueText: "Enter applicant's age in years",
    },
    {
      key: "Does the applicant have pulmonary TB symptoms?",
      value: medicalData.tbSymptoms || "Not provided",
      link: `/medical-screening#${attributeToComponentId.tbSymptoms}`,
      hiddenLabel: "whether the applicant has pulmonary TB symptoms",
      emptyValueText: "Enter whether the applicant has pulmonary TB symptoms (optional)",
    },
    {
      key: "Pulmonary TB symptoms",
      value:
        medicalData.tbSymptomsList.length > 0
          ? medicalData.tbSymptomsList.join(", ")
          : "Not provided",
      link: `/medical-screening#${attributeToComponentId.tbSymptomsList}`,
      hiddenLabel: "Pulmonary TB symptoms",
      emptyValueText: "Enter pulmonary TB symptoms (optional)",
    },
    {
      key: "Other symptoms",
      value: medicalData.otherSymptomsDetail || "Not provided",
      link: `/medical-screening#${attributeToComponentId.otherSymptomsDetail}`,
      hiddenLabel: "other symptoms",
      emptyValueText: "Enter other symptoms (optional)",
    },
    {
      key: "Applicant history if under 11",
      value:
        medicalData.underElevenConditions.length > 0
          ? medicalData.underElevenConditions.join(", ")
          : "Not provided",
      link: `/medical-screening#${attributeToComponentId.underElevenConditions}`,
      hiddenLabel: "applicant history if under 11",
      emptyValueText: "Enter applicant history if under 11 (optional)",
    },
    {
      key: "Additional details of applicant history if under 11",
      value: medicalData.underElevenConditionsDetail || "Not provided",
      link: `/medical-screening#${attributeToComponentId.underElevenConditionsDetail}`,
      hiddenLabel: "additional details of applicant history if under 11",
      emptyValueText: "Enter additional details of applicant history if under 11 (optional)",
    },
    {
      key: "Has the applicant ever had pulmonary TB?",
      value: medicalData.previousTb || "Not provided",
      link: `/medical-screening#${attributeToComponentId.previousTb}`,
      hiddenLabel: "whether the applicant has ever had pulmonary TB",
      emptyValueText: "Enter whether the applicant has ever had pulmonary TB (optional)",
    },
    {
      key: "Detail of applicant's previous pulmonary TB",
      value: medicalData.previousTbDetail || "Not provided",
      link: `/medical-screening#${attributeToComponentId.previousTbDetail}`,
      hiddenLabel: "details of applicant's previous pulmonary TB",
      emptyValueText: "Enter detail of applicant's previous pulmonary TB (optional)",
    },
    {
      key: "Has the applicant had close contact with any person with active pulmonary TB within the past year?",
      value: medicalData.closeContactWithTb || "Not provided",
      link: `/medical-screening#${attributeToComponentId.closeContactWithTb}`,
      hiddenLabel: "applicant's close contact with TB in the past year",
      emptyValueText:
        "Enter whether the applicant has had close contact with any person with active pulmonary TB within the past year (optional)",
    },
    {
      key: "Details of applicant's close contact with any person with active pulmonary TB",
      value: medicalData.closeContactWithTbDetail || "Not provided",
      link: `/medical-screening#${attributeToComponentId.closeContactWithTbDetail}`,
      hiddenLabel: "details of applicant's close contact with pulmonary TB in the past year",
      emptyValueText:
        "Enter details of applicant's close contact with any person with active pulmonary TB (optional)",
    },
    {
      key: "Is the applicant pregnant?",
      value: medicalData.pregnant || "Not provided",
      link: `/medical-screening#${attributeToComponentId.pregnant}`,
      hiddenLabel: "pregnancy",
      emptyValueText: "Enter whether the applicant is pregnant (optional)",
    },
    {
      key: "Does the applicant have menstrual periods?",
      value: medicalData.menstrualPeriods || "Not provided",
      link: `/medical-screening#${attributeToComponentId.menstrualPeriods}`,
      hiddenLabel: "menstrual periods",
      emptyValueText: "Enter whether the applicant has menstrual periods (optional)",
    },
    {
      key: "Physical examination notes",
      value: medicalData.physicalExamNotes || "Not provided",
      link: `/medical-screening#${attributeToComponentId.physicalExamNotes}`,
      hiddenLabel: "physical examination notes",
      emptyValueText: "Enter physical examination notes (optional)",
    },
    {
      key: "Is an X-ray required?",
      value: medicalData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "whether X-ray is required",
      emptyValueText: "Enter whether X-ray is required (optional)",
    },
    ...(medicalData.chestXrayTaken === YesOrNo.NO && medicalData.reasonXrayNotRequired
      ? [
          {
            key: "Reason X-ray is not required",
            value: mapBackendToDisplay(medicalData.reasonXrayNotRequired) || "Not provided",
            link: `/chest-xray-not-taken#${attributeToComponentId.reasonXrayWasNotTaken}`,
            hiddenLabel: "reason X-ray is not required",
            emptyValueText: "Enter reason X-ray is not required (optional)",
          },
        ]
      : []),
  ];

  return (
    <div>
      {isLoading && <Spinner />}

      <Summary status={medicalData.status} summaryElements={summaryData} />

      {(medicalData.status == ApplicationStatus.NOT_YET_STARTED ||
        medicalData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {(medicalData.status == ApplicationStatus.COMPLETE ||
        medicalData.status == ApplicationStatus.NOT_REQUIRED) && (
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
