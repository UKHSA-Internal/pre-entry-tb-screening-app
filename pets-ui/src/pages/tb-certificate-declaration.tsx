import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function TbCertificateDeclarationPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "enter_clinic_and_certificate_information",
      applicationData.applicationId,
      "TB certificate outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Enter clinic and certificate information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/will-you-issue-tb-clearance-certificate"
    >
      <TbCertificateDeclarationForm />
    </Container>
  );
}
