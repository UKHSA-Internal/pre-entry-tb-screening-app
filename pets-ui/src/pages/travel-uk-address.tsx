import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import ApplicantTravelAddressAndContactDetails from "@/sections/applicant-travel-uk-address";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TravelAddressAndContactDetailsPage() {
  const applicationData = useAppSelector(selectApplication);
  const travelData = useAppSelector(selectTravel);
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  let backLinkTo: string;
  if (fromParam === "/check-travel-information") {
    backLinkTo = "/check-travel-information";
  } else if (travelData.status === ApplicationStatus.COMPLETE) {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/proposed-visa-category";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Visa applicant's proposed UK address",
      applicationData.applicationId,
      "Travel Information",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Visa applicant's proposed UK address - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantTravelAddressAndContactDetails />
    </Container>
  );
}
