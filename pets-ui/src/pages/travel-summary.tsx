import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel } from "@/redux/store";
import TravelReview from "@/sections/applicant-travel-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function TravelSummaryPage() {
  const travelData = useAppSelector(selectTravel);

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
