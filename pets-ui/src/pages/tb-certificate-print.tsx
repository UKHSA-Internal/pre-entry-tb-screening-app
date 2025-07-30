import { PDFViewer, usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo, useRef } from "react";

import { CertificateTemplate } from "@/components/certificateTemplate/certificateTemplate";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { useAppSelector } from "@/redux/hooks";
import {
  selectApplicant,
  selectApplication,
  selectChestXray,
  selectMedicalScreening,
  selectSputum,
  selectTbCertificate,
  selectTravel,
} from "@/redux/store";

export default function TbCertificatePrintPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const travelData = useAppSelector(selectTravel);
  const chestXrayData = useAppSelector(selectChestXray);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const sputumData = useAppSelector(selectSputum);
  const { applicantPhotoDataUrl } = useApplicantPhoto();

  const certificate = useMemo(
    () => (
      <CertificateTemplate
        applicantData={applicantData}
        applicationData={applicationData}
        tbCertificateData={tbCertificateData}
        travelData={travelData}
        chestXrayData={chestXrayData}
        medicalScreeningData={medicalScreeningData}
        sputumData={sputumData}
        applicantPhotoUrl={applicantPhotoDataUrl}
      />
    ),
    [
      applicantData,
      applicationData,
      tbCertificateData,
      travelData,
      chestXrayData,
      medicalScreeningData,
      sputumData,
      applicantPhotoDataUrl,
    ],
  );

  const [instance, updateInstance] = usePDF({ document: certificate });

  useEffect(() => {
    updateInstance(certificate);
  }, [certificate, updateInstance]);

  const handlePrint = () => {
    if (instance.url) {
      const printWindow = window.open(instance.url);
      printWindow?.addEventListener("load", () => {
        printWindow.print();
      });
    }
  };

  return (
    <Container title="TB clearance certificate" backLinkTo="/tb-certificate-confirmation">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <Heading level={1} size="l" title="TB clearance certificate" />

          <div
            onClick={handlePrint}
            className="govuk-!-margin-bottom-6"
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handlePrint()}
          >
            <img
              src="/assets/images/printer.svg"
              alt="Print Certificate"
              className="govuk-!-margin-right-2"
              height="32"
            />
            <span className="govuk-link" style={{ fontSize: "1.25rem" }}>
              Print the certificate
            </span>
          </div>

          <div ref={certificateRef} className="certificate-container" style={{ height: "80vh" }}>
            <PDFViewer style={{ width: "100%", height: "100%" }}>{certificate}</PDFViewer>
          </div>
        </div>
      </div>
    </Container>
  );
}
