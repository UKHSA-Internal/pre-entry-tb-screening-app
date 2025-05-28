import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postTbCerificateDetails } from "@/api/api";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectApplication } from "@/redux/applicationSlice";
import { useAppSelector } from "@/redux/hooks";
import { selectTbCertificate, setTbCertificateStatus } from "@/redux/tbCertificateSlice";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import { formatDateType, standardiseDayOrMonth } from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const TbSummary = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (tbCertificateData.isIssued == YesOrNo.YES) {
        const certificateIssueDateStr = `${tbCertificateData.certificateDate.year}-${standardiseDayOrMonth(tbCertificateData.certificateDate.month)}-${standardiseDayOrMonth(tbCertificateData.certificateDate.day)}`;
        await postTbCerificateDetails(applicationData.applicationId, {
          isIssued: tbCertificateData.isIssued,
          comments: tbCertificateData.comments,
          issueDate: certificateIssueDateStr,
          certificateNumber: tbCertificateData.certificateNumber,
        });
      } else if (tbCertificateData.isIssued == YesOrNo.NO) {
        await postTbCerificateDetails(applicationData.applicationId, {
          isIssued: tbCertificateData.isIssued,
          comments: tbCertificateData.comments,
        });
      } else {
        throw new Error("certificateIssued field missing");
      }

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
      value: tbCertificateData.isIssued,
      link: `/tb-certificate-declaration#${attributeToComponentId.isIssued}`,
      hiddenLabel: "TB clearance certificate",
      emptyValueText: "Enter whether a TB clearance certificate has been issued (optional)",
    },
    {
      key: "Physician comments",
      value: tbCertificateData.comments,
      link: `/tb-certificate-declaration#${attributeToComponentId.comments}`,
      hiddenLabel: "Comments from physician",
      emptyValueText: "Enter physician comments (optional)",
    },
    {
      key: "Date of TB clearance certificate",
      value: formatDateType(tbCertificateData.certificateDate),
      link: `/tb-certificate-declaration#${attributeToComponentId.certificateDate}`,
      hiddenLabel: "Date of TB certificate",
      emptyValueText: "Enter date of TB clearance certificate (optional)",
    },
    {
      key: "TB clearance certificate number",
      value: tbCertificateData.certificateNumber,
      link: `/tb-certificate-declaration#${attributeToComponentId.certificateNumber}`,
      hiddenLabel: "TB certificate number",
      emptyValueText: "Enter TB clearance certificate number (optional)",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <ApplicantDataHeader applicantData={applicantData} />

      <Summary status={tbCertificateData.status} summaryElements={summaryData} />

      {(tbCertificateData.status == ApplicationStatus.NOT_YET_STARTED ||
        tbCertificateData.status == ApplicationStatus.IN_PROGRESS) && (
        <Button
          id="confirm"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          handleClick={handleSubmit}
        />
      )}
      {(tbCertificateData.status == ApplicationStatus.COMPLETE ||
        tbCertificateData.status == ApplicationStatus.NOT_REQUIRED) && (
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

export default TbSummary;
