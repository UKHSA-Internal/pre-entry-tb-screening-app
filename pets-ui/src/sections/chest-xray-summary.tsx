import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postChestXrayDetails } from "@/api/api";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import { selectChestXray, setChestXrayStatus } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import { spreadArrayIfNotEmpty } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const ChestXraySummary = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const chestXrayData = useAppSelector(selectChestXray);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (chestXrayData.chestXrayTaken == YesOrNo.YES) {
        await postChestXrayDetails(applicationData.applicationId, {
          chestXrayTaken: chestXrayData.chestXrayTaken,
          posteroAnteriorXrayFileName: chestXrayData.posteroAnteriorXrayFileName,
          posteroAnteriorXray: chestXrayData.posteroAnteriorXrayFile,
          apicalLordoticXrayFileName: chestXrayData.apicalLordoticXrayFileName,
          apicalLordoticXray: chestXrayData.apicalLordoticXrayFile,
          lateralDecubitusXrayFileName: chestXrayData.lateralDecubitusXrayFileName,
          lateralDecubitusXray: chestXrayData.lateralDecubitusXrayFile,
          xrayResult: chestXrayData.xrayResult,
          xrayResultDetail: chestXrayData.xrayResultDetail,
          xrayMinorFindings: chestXrayData.xrayMinorFindings,
          xrayAssociatedMinorFindings: chestXrayData.xrayAssociatedMinorFindings,
          xrayActiveTbFindings: chestXrayData.xrayActiveTbFindings,
        });
      } else {
        await postChestXrayDetails(applicationData.applicationId, {
          chestXrayTaken: chestXrayData.chestXrayTaken,
          reasonXrayWasNotTaken: chestXrayData.reasonXrayWasNotTaken,
          xrayWasNotTakenFurtherDetails: chestXrayData.xrayWasNotTakenFurtherDetails,
        });
      }

      dispatch(setChestXrayStatus(ApplicationStatus.COMPLETE));
      navigate("/chest-xray-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const xrayTakenSummaryData = [
    {
      key: "Select X-ray status",
      value: chestXrayData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "chest X-ray Status",
    },
    {
      key: "Postero anterior X-ray",
      value: chestXrayData.posteroAnteriorXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.posteroAnteriorXrayFileName}`,
      hiddenLabel: "postero anterior X-ray",
    },
    {
      key: "Apical lordotic X-ray",
      value: chestXrayData.apicalLordoticXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.apicalLordoticXrayFileName}`,
      hiddenLabel: "apical lordotic X-ray",
      emptyValueText: "Upload apical lordotic X-ray (optional)",
    },
    {
      key: "Lateral decubitus X-ray",
      value: chestXrayData.lateralDecubitusXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.lateralDecubitusXrayFileName}`,
      hiddenLabel: "lateral decubitus X-ray",
      emptyValueText: "Upload lateral decubitus X-ray (optional)",
    },
    {
      key: "Enter radiological outcome",
      value: chestXrayData.xrayResult,
      link: `/chest-xray-findings#${attributeToComponentId.xrayResult}`,
      hiddenLabel: "radiological outcome",
    },
    {
      key: "Radiological details",
      value: chestXrayData.xrayResultDetail,
      link: `/chest-xray-findings#${attributeToComponentId.xrayResultDetail}`,
      hiddenLabel: "X-ray Details",
      emptyValueText: "Enter radiological details (optional)",
    },
    {
      key: "Enter radiographic findings",
      value: spreadArrayIfNotEmpty(
        chestXrayData.xrayMinorFindings,
        chestXrayData.xrayAssociatedMinorFindings,
        chestXrayData.xrayActiveTbFindings,
      ),
      link: `/chest-xray-findings#${attributeToComponentId.xrayMinorFindings}`,
      hiddenLabel: "radiographic findings",
      emptyValueText: "Enter radiographic findings (optional)",
    },
  ];

  const xrayNotTakenSummaryData = [
    {
      key: "Select x-ray status",
      value: chestXrayData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "chest X-ray status",
      emptyValueText: "Enter X-ray status (optional)",
    },
    {
      key: "Enter reason X-ray not taken",
      value: chestXrayData.reasonXrayWasNotTaken,
      link: `/chest-xray-not-taken#${attributeToComponentId.reasonXrayWasNotTaken}`,
      hiddenLabel: "Reason why X-ray was not taken",
      emptyValueText: "Enter reason X-ray not taken (optional)",
    },
    {
      key: "Details",
      value: chestXrayData.xrayWasNotTakenFurtherDetails,
      link: `/chest-xray-not-taken#${attributeToComponentId.xrayWasNotTakenFurtherDetails}`,
      hiddenLabel: "details",
      emptyValueText: "Enter details (optional)",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <ApplicantDataHeader applicantData={applicantData} />

      {chestXrayData.chestXrayTaken == YesOrNo.YES && (
        <Summary status={chestXrayData.status} summaryElements={xrayTakenSummaryData} />
      )}
      {chestXrayData.chestXrayTaken == YesOrNo.NO && (
        <Summary status={chestXrayData.status} summaryElements={xrayNotTakenSummaryData} />
      )}

      {(chestXrayData.status == ApplicationStatus.NOT_YET_STARTED ||
        chestXrayData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {(chestXrayData.status == ApplicationStatus.COMPLETE ||
        chestXrayData.status == ApplicationStatus.NOT_REQUIRED) && (
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

export default ChestXraySummary;
