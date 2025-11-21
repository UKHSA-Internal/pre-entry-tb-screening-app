import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import TbCertificateQuestionForm from "@/sections/tb-certificate-question-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function TbCertificateQuestionPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "will_you_issue_a_tb_clearance_certificate",
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
