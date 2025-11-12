import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TbCertificateDeclarationPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Enter clinic and certificate information",
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
