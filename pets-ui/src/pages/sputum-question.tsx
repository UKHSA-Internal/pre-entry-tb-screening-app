import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import SputumQuestionForm from "@/sections/sputum-question-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function SputumQuestionPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Is sputum collection required?",
      applicationData.applicationId,
      "Make a sputum decision",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Is sputum collection required? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <SputumQuestionForm />
    </Container>
  );
}
