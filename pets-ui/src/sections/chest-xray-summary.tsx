import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postChestXrayDetails } from "@/api/api";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Summary, { SummaryElement } from "@/components/summary/summary";
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

  const handleSubmit = async () => {
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
      key: "Select x-ray status",
      value: chestXrayData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "chest X-ray Status",
    },
    {
      key: "Postero anterior x-ray",
      value: chestXrayData.posteroAnteriorXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.posteroAnteriorXrayFileName}`,
      hiddenLabel: "postero-anterior X-ray",
    },
    {
      key: "Apical lordotic x-ray",
      value: chestXrayData.apicalLordoticXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.apicalLordoticXrayFileName}`,
      hiddenLabel: "apical lordotic X-ray",
    },
    {
      key: "Lateral decubitus x-ray",
      value: chestXrayData.lateralDecubitusXrayFileName,
      link: `/chest-xray-upload#${attributeToComponentId.lateralDecubitusXrayFileName}`,
      hiddenLabel: "lateral decubitus X-ray",
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
    },
    {
      key: "Enter radiographic findings",
      value: spreadArrayIfNotEmpty(
        chestXrayData.xrayMinorFindings,
        chestXrayData.xrayAssociatedMinorFindings,
        chestXrayData.xrayActiveTbFindings,
      ),
      link: `/chest-xray-findings#${attributeToComponentId.xrayMinorFindings}`,
      hiddenLabel: "radiographic Findings",
    },
  ];

  const xrayNotTakenSummaryData = [
    {
      key: "Select x-ray status",
      value: chestXrayData.chestXrayTaken,
      link: `/chest-xray-question#${attributeToComponentId.chestXrayTaken}`,
      hiddenLabel: "Chest X-ray Status",
    },
    {
      key: "Enter reason X-ray not taken",
      value: chestXrayData.reasonXrayWasNotTaken,
      link: `/chest-xray-not-taken#${attributeToComponentId.reasonXrayWasNotTaken}`,
      hiddenLabel: "Reason why X-ray was not taken",
    },
  ];

  const isDataPresent = (
    summaryElement: Partial<SummaryElement>,
  ): summaryElement is SummaryElement => {
    const { value } = summaryElement;
    return Array.isArray(value) ? value.length > 0 : !!value;
  };

  return (
    <div>
      <ApplicantDataHeader applicantData={applicantData} />

      {chestXrayData.chestXrayTaken == YesOrNo.YES && (
        <Summary
          status={chestXrayData.status}
          summaryElements={xrayTakenSummaryData.filter(isDataPresent)}
        />
      )}
      {chestXrayData.chestXrayTaken == YesOrNo.NO && (
        <Summary
          status={chestXrayData.status}
          summaryElements={xrayNotTakenSummaryData.filter(isDataPresent)}
        />
      )}

      {chestXrayData.status == ApplicationStatus.INCOMPLETE && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Confirm"
          href="/chest-xray-confirmation"
          handleClick={handleSubmit}
        />
      )}
      {chestXrayData.status == ApplicationStatus.COMPLETE && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to tracker"
          href="/tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default ChestXraySummary;
