import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ApplicantConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Visa applicant details confirmed",
      applicationData.applicationId,
      "Visa Applicant Details",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Visa applicant details confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Visa applicant details confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
