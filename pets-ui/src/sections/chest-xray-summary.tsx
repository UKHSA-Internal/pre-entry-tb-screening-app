import { useNavigate } from "react-router-dom";

import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Summary, { SummaryElement } from "@/components/summary/summary";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectChestXray } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/utils/enums";

const ChestXraySummary = () => {
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);
  const navigate = useNavigate();

  const xraySummaryData = [
    {
      key: "Select x-ray status",
      value: chestXrayData.chestXrayTaken ? "Yes" : "No",
      link: "/chest-xray-question#chestXrayTaken",
      hiddenLabel: "Chest X-ray Status",
    },
    {
      key: "Postero anterior x-ray",
      value: chestXrayData.posteroAnteriorXrayFileName,
      link: "/chest-xray-upload#postero-anterior-xray",
      hiddenLabel: "Postero-anterior X-ray",
    },
    {
      key: "Apical lordotic x-ray",
      value: chestXrayData.apicalLordoticXrayFileName,
      link: "/chest-xray-upload#apical-lordotic-xray",
      hiddenLabel: "Postero-anterior X-ray",
    },
    {
      key: "Lateral decubitus x-ray",
      value: chestXrayData.lateralDecubitusXrayFileName,
      link: "/chest-xray-upload#lateral-decubitus-xray",
      hiddenLabel: "Postero-anterior X-ray",
    },
    {
      key: "Enter radiological outcome",
      value: chestXrayData.xrayResult,
      link: "/chest-xray-findings#xray-result",
      hiddenLabel: "X-ray Result",
    },
    {
      key: "Radiological details",
      value: chestXrayData.xrayResultDetail,
      link: "/chest-xray-findings#xray-minor-findings",
      hiddenLabel: "X-ray Details",
    },
    {
      key: "Minor findings",
      value: chestXrayData.xrayMinorFindings,
      link: "/chest-xray-findings#xray-result-detail",
      hiddenLabel: "X-ray Minor Findings",
    },
    {
      key: "Minor findings occasionally associated with TB",
      value: chestXrayData.xrayAssociatedMinorFindings,
      link: "/chest-xray-findings#xray-associated-minor-findings",
      hiddenLabel: "X-ray Minor Findings TB Assoc",
    },
    {
      key: "Findings sometimes seen in active TB (or other conditions)",
      value: chestXrayData.xrayActiveTbFindings,
      link: "/chest-xray-findings#xray-active-tb-findings",
      hiddenLabel: "X-ray Minor Findings Active TB",
    },
    {
      key: "Enter reason X-ray not taken",
      value: chestXrayData.reasonXrayWasNotTaken,
      link: "/chest-xray-not-taken#reasonXrayWasNotTaken",
      hiddenLabel: "Reason X-ray not taken",
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
      <Summary summaryElements={xraySummaryData.filter(isDataPresent)} />
      <Button
        id="save-and-continue"
        type={ButtonType.DEFAULT}
        text="Save and continue"
        href="/chest-xray-confirmation"
        handleClick={() => navigate("/chest-xray-confirmation")}
      />
    </div>
  );
};

export default ChestXraySummary;
