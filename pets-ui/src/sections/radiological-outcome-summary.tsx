import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postChestXrayDetails, postRadiologicalOutcomeDetails } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { setRadiologicalOutcomeStatus } from "@/redux/radiologicalOutcomeSlice";
import { selectApplication, selectRadiologicalOutcome } from "@/redux/store";
import { PostedRadiologicalOutcomeDetailsType } from "@/types";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import { spreadArrayIfNotEmpty } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const RadiologicalOutcomeSummary = () => {
  const applicationData = useAppSelector(selectApplication);
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (radiologicalOutcomeData.chestXrayTaken == YesOrNo.YES) {
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
      navigate("/radiological-outcome-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const xrayTakenSummaryData = [
    {
      key: "Chest X-ray results",
      value: radiologicalOutcomeData.xrayResult,
      link: `/radiological-outcome-chest-xray-results#${attributeToComponentId.xrayResult}`,
      hiddenLabel: "chest X-ray results",
    },
    {
      key: "X-ray findings",
      value: spreadArrayIfNotEmpty(
        radiologicalOutcomeData.xrayMinorFindings,
        radiologicalOutcomeData.xrayAssociatedMinorFindings,
        radiologicalOutcomeData.xrayActiveTbFindings,
      ),
      link: `/radiological-outcome-findings#${attributeToComponentId.xrayMinorFindings}`,
      hiddenLabel: "X-ray findings",
      emptyValueText: "Enter X-ray findings (optional)",
    },
    {
      key: "Give further details (optional)",
      value: radiologicalOutcomeData.xrayResultDetail,
      link: `/radiological-outcome-findings#${attributeToComponentId.xrayResultDetail}`,
      hiddenLabel: "further details",
      emptyValueText: "Give further details (optional)",
    },
  ];

  const xrayNotTakenSummaryData = [
    {
      key: "Select X-ray status",
      value: radiologicalOutcomeData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "chest X-ray status",
      emptyValueText: "Enter X-ray status (optional)",
    },
    {
      key: "Enter reason X-ray not taken",
      value: radiologicalOutcomeData.reasonXrayWasNotTaken,
      link: `/chest-xray-not-taken#${attributeToComponentId.reasonXrayWasNotTaken}`,
      hiddenLabel: "Reason why X-ray was not taken",
      emptyValueText: "Enter reason X-ray not taken (optional)",
    },
    {
      key: "Details",
      value: radiologicalOutcomeData.xrayWasNotTakenFurtherDetails,
      link: `/chest-xray-not-taken#${attributeToComponentId.xrayWasNotTakenFurtherDetails}`,
      hiddenLabel: "details",
      emptyValueText: "Enter details (optional)",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}

      {radiologicalOutcomeData.chestXrayTaken == YesOrNo.YES && (
        <Summary status={radiologicalOutcomeData.status} summaryElements={xrayTakenSummaryData} />
      )}
      {radiologicalOutcomeData.chestXrayTaken == YesOrNo.NO && (
        <Summary
          status={radiologicalOutcomeData.status}
          summaryElements={xrayNotTakenSummaryData}
        />
      )}

      {(radiologicalOutcomeData.status == ApplicationStatus.NOT_YET_STARTED ||
        radiologicalOutcomeData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
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
