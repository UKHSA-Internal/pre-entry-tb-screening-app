import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel } from "@/redux/travelSlice";
import TravelReview from "@/sections/applicant-travel-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function TravelSummaryPage() {
  const travelData = useAppSelector(selectTravel);

  return (
    <Container
      title="Applicant travel information summary"
      backLinkTo={travelData.status == ApplicationStatus.COMPLETE ? "/tracker" : "/travel-details"}
    >
      <Heading level={1} size="l" title="Check travel information" />
      <TravelReview />
    </Container>
  );
}
