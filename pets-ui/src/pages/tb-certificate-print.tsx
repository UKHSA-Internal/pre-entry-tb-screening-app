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
  selectClinic,
  selectMedicalScreening,
  selectTbCertificate,
  selectTravel,
} from "@/redux/store";

export default function TbCertificatePrintPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const tbCertificateData = useAppSelector(selectTbCertificate);
  const travelData = useAppSelector(selectTravel);
  const medicalScreeningData = useAppSelector(selectMedicalScreening);
  const { applicantPhotoDataUrl } = useApplicantPhoto();
  const clinic = useAppSelector(selectClinic);

  const certificate = useMemo(
    () => (
      <CertificateTemplate
        applicantData={applicantData}
        applicationData={applicationData}
        tbCertificateData={tbCertificateData}
        travelData={travelData}
        medicalScreeningData={medicalScreeningData}
        applicantPhotoUrl={applicantPhotoDataUrl}
        clinic={clinic}
      />
    ),
    [
      applicantData,
      applicationData,
      tbCertificateData,
      travelData,
      medicalScreeningData,
      applicantPhotoDataUrl,
      clinic,
    ],
  );

  const [instance, updateInstance] = usePDF({ document: certificate });

  useEffect(() => {
    updateInstance(certificate);
  }, [certificate, updateInstance]);

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    if (instance.url) {
      const printWindow = window.open(instance.url);
      printWindow?.addEventListener("load", () => {
        printWindow.print();
      });
    }
  };

  return (
    <Container
      title="TB clearance certificate - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tb-certificate-confirmation"
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <Heading level={1} size="l" title="TB clearance certificate" />

          <div className="govuk-!-margin-bottom-6">
            <a
              href={instance.url ?? "#"}
              onClick={handlePrint}
              className="print-trigger govuk-link"
            >
              <img
                src="/assets/images/printer.svg"
                alt="Print Certificate"
                className="govuk-!-margin-right-2"
                height="32"
              />
              <span>Print the certificate</span>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={certificateRef}
        style={{
          width: "1100px",
          height: "770px",
          marginLeft: "calc(50% - 550px)",
        }}
      >
        <PDFViewer style={{ width: "100%", height: "100%" }} showToolbar={false}>
          {certificate}
        </PDFViewer>
      </div>
    </Container>
  );
}
