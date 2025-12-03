import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import TravelReview from "@/sections/applicant-travel-summary";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function TravelSummaryPage() {
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "check_uk_travel_information",
      applicationData.applicationId,
      "Travel Information",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Check UK travel information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        travelData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/visa-applicant-proposed-uk-address"
      }
    >
      <Heading level={1} size="l" title="Check UK travel information" />
      <TravelReview />
    </Container>
  );
}
