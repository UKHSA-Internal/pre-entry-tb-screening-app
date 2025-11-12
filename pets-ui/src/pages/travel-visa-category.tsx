import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import ApplicantTravelVisaCategory from "@/sections/applicant-travel-visa-category";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TravelVisaCategoryPage() {
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);
  const backLinkTo =
    travelData.status === ApplicationStatus.COMPLETE ? "/tb-certificate-summary" : "/tracker";

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Proposed visa category",
      applicationData.applicationId,
      "Travel Information",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Proposed visa category - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantTravelVisaCategory />
    </Container>
  );
}
