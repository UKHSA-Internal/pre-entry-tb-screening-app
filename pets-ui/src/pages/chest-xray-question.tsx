import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ChestXrayQuestionForm from "@/sections/chest-xray-question-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ChestXrayQuestionPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Is an X-ray required?",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Is an X-ray required? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/record-medical-history-tb-symptoms"
    >
      <ChestXrayQuestionForm />
    </Container>
  );
}
