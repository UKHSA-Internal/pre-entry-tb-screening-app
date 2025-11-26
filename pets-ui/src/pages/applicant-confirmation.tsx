import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function ApplicantConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "visa_applicant_details_confirmed",
      applicationData.applicationId,
      "Visa Applicant Details",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Visa applicant details confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Visa applicant details confirmed"}
        furtherInfo={[
          "We have sent the visa applicant details to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
