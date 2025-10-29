import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postChestXrayDetails, postRadiologicalOutcomeDetails } from "@/api/api";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { setRadiologicalOutcomeStatus } from "@/redux/radiologicalOutcomeSlice";
import {
  selectApplication,
  selectMedicalScreening,
  selectRadiologicalOutcome,
} from "@/redux/store";
import { PostedRadiologicalOutcomeDetailsType } from "@/types";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import { spreadArrayIfNotEmpty } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const RadiologicalOutcomeSummary = () => {
  const applicationData = useAppSelector(selectApplication);
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (medicalScreeningData.chestXrayTaken == YesOrNo.YES) {
        const payload: PostedRadiologicalOutcomeDetailsType = {
          xrayResult: radiologicalOutcomeData.xrayResult,
          xrayResultDetail: radiologicalOutcomeData.xrayResultDetail,
          xrayMinorFindings: radiologicalOutcomeData.xrayMinorFindings,
          xrayAssociatedMinorFindings: radiologicalOutcomeData.xrayAssociatedMinorFindings,
          xrayActiveTbFindings: radiologicalOutcomeData.xrayActiveTbFindings,
        };
        await postRadiologicalOutcomeDetails(applicationData.applicationId, payload);
      } else {
        const payload = {
          chestXrayTaken: YesOrNo.NO as YesOrNo.NO,
          reasonXrayWasNotTaken: radiologicalOutcomeData.reasonXrayWasNotTaken,
          xrayWasNotTakenFurtherDetails: radiologicalOutcomeData.xrayWasNotTakenFurtherDetails,
        };
        await postChestXrayDetails(applicationData.applicationId, payload);
      }

      dispatch(setRadiologicalOutcomeStatus(ApplicationStatus.COMPLETE));
      navigate("/radiological-outcome-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const xrayTakenSummaryData = [
    {
      key: "Chest X-ray results",
      value: radiologicalOutcomeData.xrayResult,
      link: `/chest-x-ray-results#${attributeToComponentId.xrayResult}`,
      hiddenLabel: "chest X-ray results",
    },
    {
      key: "X-ray findings",
      value: (() => {
        const findings = spreadArrayIfNotEmpty(
          radiologicalOutcomeData.xrayMinorFindings,
          radiologicalOutcomeData.xrayAssociatedMinorFindings,
          radiologicalOutcomeData.xrayActiveTbFindings,
        );
        return findings.length > 0 ? findings : "Not provided";
      })(),
      link: `/enter-x-ray-findings#${attributeToComponentId.xrayMinorFindings}`,
      hiddenLabel: "X-ray findings",
    },
    {
      key: "Give further details (optional)",
      value: radiologicalOutcomeData.xrayResultDetail || "Not provided",
      link: `/enter-x-ray-findings#${attributeToComponentId.xrayResultDetail}`,
      hiddenLabel: "further details",
    },
  ];

  const xrayNotTakenSummaryData = [
    {
      key: "Select X-ray status",
      value: medicalScreeningData.chestXrayTaken,
      link: `/is-an-x-ray-required#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "chest X-ray status",
    },
    {
      key: "Enter reason X-ray not taken",
      value: radiologicalOutcomeData.reasonXrayWasNotTaken,
      link: `/reason-x-ray-not-required#${attributeToComponentId.reasonXrayWasNotTaken}`,
      hiddenLabel: "Reason why X-ray was not taken",
    },
    {
      key: "Details",
      value: radiologicalOutcomeData.xrayWasNotTakenFurtherDetails,
      link: `/reason-x-ray-not-required#${attributeToComponentId.xrayWasNotTakenFurtherDetails}`,
      hiddenLabel: "details",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}

      {medicalScreeningData.chestXrayTaken == YesOrNo.YES && (
        <Summary status={radiologicalOutcomeData.status} summaryElements={xrayTakenSummaryData} />
      )}
      {medicalScreeningData.chestXrayTaken == YesOrNo.NO && (
        <Summary
          status={radiologicalOutcomeData.status}
          summaryElements={xrayNotTakenSummaryData}
        />
      )}

      {(radiologicalOutcomeData.status == ApplicationStatus.NOT_YET_STARTED ||
        radiologicalOutcomeData.status == ApplicationStatus.IN_PROGRESS) && (
        <div>
          <Heading title="Now send the chest X-ray results and findings" level={2} size="m" />
          <p className="govuk-body">
            You will not be able to change the X-ray results and findings after you submit this
            information.
          </p>

          <Button
            id="confirm"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            handleClick={handleSubmit}
          />
        </div>
      )}
      {(radiologicalOutcomeData.status == ApplicationStatus.COMPLETE ||
        radiologicalOutcomeData.status == ApplicationStatus.NOT_REQUIRED) && (
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

export default RadiologicalOutcomeSummary;
