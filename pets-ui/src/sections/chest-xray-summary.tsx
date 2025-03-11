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
      key: "Upload chest x-ray images",
      value: [
        chestXrayData.posteroAnteriorXrayFileName ?? "",
        chestXrayData.apicalLordoticXrayFileName ?? "",
        chestXrayData.lateralDecubitusXrayFileName ?? "",
      ],
      link: "/chest-xray-upload",
      hiddenLabel: "Chest x-ray images",
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
      link: "/chest-xray-findings#xray-result-detail",
      hiddenLabel: "X-ray Details",
    },
    {
      key: "Enter radiographic findings",
      value: [
        ...chestXrayData.xrayMinorFindings,
        ...chestXrayData.xrayAssociatedMinorFindings,
        ...chestXrayData.xrayActiveTbFindings,
      ],
      link: "/chest-xray-findings",
      hiddenLabel: "X-ray Minor Findings",
    },
    {
      key: "Enter reason x-ray not taken",
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
