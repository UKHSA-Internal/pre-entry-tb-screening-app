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
      key: "Select X-ray Status",
      value: chestXrayData.chestXrayTaken ? "Yes" : "No",
      link: "/chest-xray-question#chestXrayTaken",
      hiddenLabel: "Chest X-ray Status",
    },
    {
      key: "Postero anterior X-ray",
      value: chestXrayData.posteroAnteriorXrayFile,
      link: "/chest-xray-upload",
      hiddenLabel: "Postero-anterior X-ray",
    },
    {
      key: "Apical lordotic X-ray",
      value: chestXrayData.apicalLordoticXrayFile,
      link: "/chest-xray-upload",
      hiddenLabel: "Postero-anterior X-ray",
    },
    {
      key: "Lateral decubitus X-ray",
      value: chestXrayData.lateralDecubitusXrayFile,
      link: "/chest-xray-upload",
      hiddenLabel: "Postero-anterior X-ray",
    },
    {
      key: "Chest X-ray Result",
      value: chestXrayData.xrayResult,
      link: "/chest-xray-findings",
      hiddenLabel: "X-ray Result",
    },
    {
      key: "Chest X-ray Details",
      value: chestXrayData.xrayResultDetail,
      link: "/chest-xray-findings",
      hiddenLabel: "X-ray Details",
    },
    {
      key: "Minor Findings",
      value: chestXrayData.xrayMinorFindings,
      link: "/chest-xray-findings",
      hiddenLabel: "X-ray Minor Findings",
    },
    {
      key: "Minor Findings Occasionally Associated with TB",
      value: chestXrayData.xrayAssociatedMinorFindings,
      link: "/chest-xray-findings",
      hiddenLabel: "X-ray Minor Findings TB Assoc",
    },
    {
      key: "Findings Sometimes Seen in Active TB (or Other Conditions)",
      value: chestXrayData.xrayActiveTbFindings,
      link: "/chest-xray-findings",
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
