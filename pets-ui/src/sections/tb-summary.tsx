import { useNavigate } from "react-router-dom";

import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Summary from "@/components/summary/summary";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate } from "@/redux/tbCertificateSlice";
import { ButtonType } from "@/utils/enums";
import { formatDateType, isDataPresent } from "@/utils/helpers";

const TbSummary = () => {
  const applicantData = useAppSelector(selectApplicant);
  const tbData = useAppSelector(selectTbCertificate);
  const navigate = useNavigate();

  const tbSummaryData = [
    {
      key: "TB clearance certificate issued?",
      value: tbData.tbClearanceIssued,
      link: "/tb-certificate-declaration#tbClearanceIssued",
      hiddenLabel: "TB clearance certificate",
    },
    {
      key: "Physician comments",
      value: tbData.physicianComments,
      link: "/tb-certificate-declaration",
      hiddenLabel: "Comments from physician",
    },
    {
      key: "Date of TB clearance certificate",
      value: formatDateType(tbData.tbCertificateDate),
      link: "/tb-certificate-declaration#tbCertificateDate",
      hiddenLabel: "Date of TB certificate",
    },
    {
      key: "TB clearance certificate number",
      value: tbData.tbCertificateNumber,
      link: "/tb-certificate-declaration#tbCertificateNumber",
      hiddenLabel: "TB certificate number",
    },
  ];

  return (
    <div>
      <ApplicantDataHeader applicantData={applicantData} />
      <Summary summaryElements={tbSummaryData.filter(isDataPresent)} />
      <Button
        id="save-and-continue"
        type={ButtonType.DEFAULT}
        text="Save and continue"
        href="/chest-xray-confirmation"
        handleClick={() => navigate("/tb-confirmation")}
      />
    </div>
  );
};

export default TbSummary;
