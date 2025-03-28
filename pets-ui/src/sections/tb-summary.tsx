import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postTbCerificateDetails } from "@/api/api";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Summary from "@/components/summary/summary";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate, setTbCertificateStatus } from "@/redux/tbCertificateSlice";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { formatDateType, isDataPresent, standardiseDayOrMonth } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const TbSummary = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const certificateIssueDateStr = `${tbCertificateData.tbCertificateDate.year}-${standardiseDayOrMonth(tbCertificateData.tbCertificateDate.month)}-${standardiseDayOrMonth(tbCertificateData.tbCertificateDate.day)}`;
      await postTbCerificateDetails(applicationData.applicationId, {
        certificateIssued: tbCertificateData.tbClearanceIssued,
        certificateComments: tbCertificateData.physicianComments,
        certificateIssueDate: certificateIssueDateStr,
        certificateNumber: tbCertificateData.tbCertificateNumber,
      });

      dispatch(setTbCertificateStatus(ApplicationStatus.COMPLETE));
      navigate("/tb-certificate-confirmation");
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  const summaryData = [
    {
      key: "TB clearance certificate issued?",
      value: tbCertificateData.tbClearanceIssued,
      link: `/tb-certificate-declaration#${attributeToComponentId.tbClearanceIssued}`,
      hiddenLabel: "TB clearance certificate",
    },
    {
      key: "Physician comments",
      value: tbCertificateData.physicianComments,
      link: `/tb-certificate-declaration#${attributeToComponentId.physicianComments}`,
      hiddenLabel: "Comments from physician",
    },
    {
      key: "Date of TB clearance certificate",
      value: formatDateType(tbCertificateData.tbCertificateDate),
      link: `/tb-certificate-declaration#${attributeToComponentId.tbCertificateDate}`,
      hiddenLabel: "Date of TB certificate",
    },
    {
      key: "TB clearance certificate number",
      value: tbCertificateData.tbCertificateNumber,
      link: `/tb-certificate-declaration#${attributeToComponentId.tbCertificateNumber}`,
      hiddenLabel: "TB certificate number",
    },
  ];

  return (
    <div>
      <ApplicantDataHeader applicantData={applicantData} />

      <Summary
        status={tbCertificateData.status}
        summaryElements={summaryData.filter(isDataPresent)}
      />

      {tbCertificateData.status == ApplicationStatus.INCOMPLETE && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/tb-certificate-confirmation"
          handleClick={handleSubmit}
        />
      )}
      {tbCertificateData.status == ApplicationStatus.COMPLETE && (
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

export default TbSummary;
