import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postRadiologicalOutcomeDetails } from "@/api/api";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { useAppSelector } from "@/redux/hooks";
import { setRadiologicalOutcomeStatus } from "@/redux/radiologicalOutcomeSlice";
import { setSputumStatus } from "@/redux/sputumSlice";
import { selectApplication, selectRadiologicalOutcome } from "@/redux/store";
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
        await postRadiologicalOutcomeDetails(applicationData.applicationId, {
          chestXrayTaken: radiologicalOutcomeData.chestXrayTaken,
          posteroAnteriorXrayFileName: radiologicalOutcomeData.posteroAnteriorXrayFileName,
          posteroAnteriorXray: radiologicalOutcomeData.posteroAnteriorXrayFile,
          apicalLordoticXrayFileName: radiologicalOutcomeData.apicalLordoticXrayFileName,
          apicalLordoticXray: radiologicalOutcomeData.apicalLordoticXrayFile,
          lateralDecubitusXrayFileName: radiologicalOutcomeData.lateralDecubitusXrayFileName,
          lateralDecubitusXray: radiologicalOutcomeData.lateralDecubitusXrayFile,
          xrayResult: radiologicalOutcomeData.xrayResult,
          xrayResultDetail: radiologicalOutcomeData.xrayResultDetail,
          xrayMinorFindings: radiologicalOutcomeData.xrayMinorFindings,
          xrayAssociatedMinorFindings: radiologicalOutcomeData.xrayAssociatedMinorFindings,
          xrayActiveTbFindings: radiologicalOutcomeData.xrayActiveTbFindings,
          isSputumRequired: radiologicalOutcomeData.isSputumRequired,
        });
      } else {
        await postRadiologicalOutcomeDetails(applicationData.applicationId, {
          chestXrayTaken: radiologicalOutcomeData.chestXrayTaken,
          reasonXrayWasNotTaken: radiologicalOutcomeData.reasonXrayWasNotTaken,
          xrayWasNotTakenFurtherDetails: radiologicalOutcomeData.xrayWasNotTakenFurtherDetails,
          isSputumRequired: radiologicalOutcomeData.isSputumRequired,
        });
      }

      if (radiologicalOutcomeData.isSputumRequired == YesOrNo.NO) {
        dispatch(setSputumStatus(ApplicationStatus.NOT_REQUIRED));
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
      key: "Select X-ray status",
      value: radiologicalOutcomeData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "chest X-ray Status",
    },
    {
      key: "Postero anterior X-ray",
      value: radiologicalOutcomeData.posteroAnteriorXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.posteroAnteriorXrayFileName}`,
      hiddenLabel: "postero anterior X-ray",
    },
    {
      key: "Apical lordotic X-ray",
      value: radiologicalOutcomeData.apicalLordoticXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.apicalLordoticXrayFileName}`,
      hiddenLabel: "apical lordotic X-ray",
      emptyValueText: "Upload apical lordotic X-ray (optional)",
    },
    {
      key: "Lateral decubitus X-ray",
      value: radiologicalOutcomeData.lateralDecubitusXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.lateralDecubitusXrayFileName}`,
      hiddenLabel: "lateral decubitus X-ray",
      emptyValueText: "Upload lateral decubitus X-ray (optional)",
    },
    {
      key: "Enter radiological outcome",
      value: radiologicalOutcomeData.xrayResult,
      link: `/chest-xray-findings#${attributeToComponentId.xrayResult}`,
      hiddenLabel: "radiological outcome",
    },
    {
      key: "Radiological details",
      value: radiologicalOutcomeData.xrayResultDetail,
      link: `/chest-xray-findings#${attributeToComponentId.xrayResultDetail}`,
      hiddenLabel: "X-ray Details",
      emptyValueText: "Enter radiological details (optional)",
    },
    {
      key: "Enter radiographic findings",
      value: spreadArrayIfNotEmpty(
        radiologicalOutcomeData.xrayMinorFindings,
        radiologicalOutcomeData.xrayAssociatedMinorFindings,
        radiologicalOutcomeData.xrayActiveTbFindings,
      ),
      link: `/chest-xray-findings#${attributeToComponentId.xrayMinorFindings}`,
      hiddenLabel: "radiographic findings",
      emptyValueText: "Enter radiographic findings (optional)",
    },
    {
      key: "Sputum required?",
      value: radiologicalOutcomeData.isSputumRequired,
      link: `/sputum-question`,
      hiddenLabel: "if sputum is required",
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
    {
      key: "Sputum required?",
      value: radiologicalOutcomeData.isSputumRequired,
      link: `/sputum-question`,
      hiddenLabel: "if sputum is required",
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
