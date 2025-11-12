import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import TbCertificateQuestionForm from "@/sections/tb-certificate-question-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TbCertificateQuestionPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Will you issue a TB clearance certificate?",
      applicationData.applicationId,
      "TB certificate outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Will you issue a TB clearance certificate? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <TbCertificateQuestionForm />
    </Container>
  );
}
