import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import TbCertificateNotIssuedForm from "@/sections/tb-certificate-not-issued-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TbCertificateNotIssuedPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "why_are_you_not_issuing_a_certificate",
      applicationData.applicationId,
      "TB certificate outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Why are you not issuing a certificate? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/will-you-issue-tb-clearance-certificate"
    >
      <TbCertificateNotIssuedForm />
    </Container>
  );
}
