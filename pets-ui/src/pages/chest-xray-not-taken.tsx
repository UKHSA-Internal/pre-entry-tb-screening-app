import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ChestXrayNotTakenForm from "@/sections/chest-xray-not-taken-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ChestXrayNotTaken() {
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
      title="Reason X-ray is not required - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/is-an-x-ray-required"
    >
      <ChestXrayNotTakenForm />
    </Container>
  );
}
