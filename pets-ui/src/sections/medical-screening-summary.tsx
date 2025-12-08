import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { postMedicalDetails } from "@/api/api";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { setMedicalScreeningStatus } from "@/redux/medicalScreeningSlice";
import { selectApplicant, selectApplication, selectMedicalScreening } from "@/redux/store";
import { ApplicationStatus, ButtonClass, YesOrNo } from "@/utils/enums";
import { calculateApplicantAge, formatDateForDisplay } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const MedicalScreeningReview = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicantAge = calculateApplicantAge(applicantData.dateOfBirth);

  const applicationData = useAppSelector(selectApplication);
  const medicalData = useAppSelector(selectMedicalScreening);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const mapBackendToDisplay = (backendValue: string): string => {
    if (backendValue === "Child") {
      return "Child (under 11 years)";
    } else {
      return backendValue;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
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
        reasonXrayNotRequired: medicalData.reasonXrayNotRequired,
        reasonXrayNotRequiredFurtherDetails: medicalData.reasonXrayNotRequiredFurtherDetails,
      });

      dispatch(setMedicalScreeningStatus(ApplicationStatus.COMPLETE));
      navigate("/medical-history-tb-symptoms-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const summaryData = [
    {
      key: "Age",
      value: applicantAge.ageToDisplay,
      hiddenLabel: "age",
    },
    {
      key: "Date of medical screening",
      value: formatDateForDisplay(medicalData.completionDate) || "Not provided",
      link: `/record-medical-history-tb-symptoms#medical-screening-completion-date`,
      hiddenLabel: "date of medical screening",
    },

    {
      key: "Does the visa applicant have pulmonary TB symptoms?",
      value: medicalData.tbSymptoms || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.tbSymptoms}`,
      hiddenLabel: "whether the visa applicant has pulmonary TB symptoms",
    },
    {
      key: "If yes, which pulmonary TB symptoms",
      value:
        medicalData.tbSymptomsList.length > 0
          ? medicalData.tbSymptomsList.join(", ")
          : "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.tbSymptomsList}`,
      hiddenLabel: "pulmonary TB symptoms",
    },
    {
      key: "Give further details (optional)",
      value: medicalData.otherSymptomsDetail || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.otherSymptomsDetail}`,
      hiddenLabel: "further details of pulmonary TB symptoms (optional)",
    },
    {
      key: "Medical history for under 11",
      value:
        medicalData.underElevenConditions.length > 0
          ? medicalData.underElevenConditions.join(", ")
          : "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.underElevenConditions}`,
      hiddenLabel: "medical history for under 11",
    },
    {
      key: "Give further details (optional)",
      value: medicalData.underElevenConditionsDetail || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.underElevenConditionsDetail}`,
      hiddenLabel: "further details of medical history for under 11 (optional)",
    },
    {
      key: "Has the visa applicant had pulmonary TB?",
      value: medicalData.previousTb || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.previousTb}`,
      hiddenLabel: "whether the visa applicant has had pulmonary TB",
    },
    {
      key: "If yes, give details (optional)",
      value: medicalData.previousTbDetail || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.previousTbDetail}`,
      hiddenLabel: "details of visa applicant's previous pulmonary TB",
    },
    {
      key: "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
      value: medicalData.closeContactWithTb || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.closeContactWithTb}`,
      hiddenLabel:
        "whether the visa applicant has had close contact with active pulmonary TB in the past year",
    },
    {
      key: "If yes, give details",
      value: medicalData.closeContactWithTbDetail || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.closeContactWithTbDetail}`,
      hiddenLabel:
        "details of visa applicant's close contact with a person with pulmonary TB in the past year",
    },
    {
      key: "Is the visa applicant pregnant?",
      value: medicalData.pregnant || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.pregnant}`,
      hiddenLabel: "whether the visa applicant is pregnant",
    },
    {
      key: "Does the visa applicant have menstrual periods?",
      value: medicalData.menstrualPeriods || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.menstrualPeriods}`,
      hiddenLabel: "whether the visa applicant has menstrual periods",
    },
    {
      key: "Physical examination notes (optional)",
      value: medicalData.physicalExamNotes || "Not provided",
      link: `/record-medical-history-tb-symptoms#${attributeToComponentId.physicalExamNotes}`,
      hiddenLabel: "physical examination notes (optional)",
    },
    {
      key: "Is an X-ray required?",
      value: medicalData.chestXrayTaken,
      link: `/is-an-x-ray-required#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "whether an X-ray is required",
    },
    ...(medicalData.chestXrayTaken === YesOrNo.NO && medicalData.reasonXrayNotRequired
      ? [
          {
            key: "Reason X-ray is not required",
            value: mapBackendToDisplay(medicalData.reasonXrayNotRequired) || "Not provided",
            link: `/reason-x-ray-not-required#${attributeToComponentId.reasonXrayWasNotTaken}`,
            hiddenLabel: "reason X-ray is not required",
          },
        ]
      : []),
    ...(medicalData.chestXrayTaken === YesOrNo.NO &&
    medicalData.reasonXrayNotRequired === "Other" &&
    medicalData.reasonXrayNotRequiredFurtherDetails
      ? [
          {
            key: "Other reason X-ray is not required",
            value: medicalData.reasonXrayNotRequiredFurtherDetails || "Not provided",
            link: `/reason-x-ray-not-required#reason-xray-not-required-other-detail`,
            hiddenLabel: "other reason X-ray is not required",
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
        <div>
          <Heading title="Now send the medical history and TB symptoms" level={2} size="m" />
          <p className="govuk-body">
            You will not be able to change the medical history and TB symptoms after you submit this
            information.
          </p>

          <Button
            id="submit"
            class={ButtonClass.DEFAULT}
            text="Submit and continue"
            handleClick={handleSubmit}
          />
        </div>
      )}
      {(medicalData.status == ApplicationStatus.COMPLETE ||
        medicalData.status == ApplicationStatus.NOT_REQUIRED) && (
        <Button
          id="back-to-tracker"
          class={ButtonClass.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default MedicalScreeningReview;
