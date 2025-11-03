import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel } from "@/redux/store";
import ApplicantTravelVisaCategory from "@/sections/applicant-travel-visa-category";
import { ApplicationStatus } from "@/utils/enums";

export default function TravelVisaCategoryPage() {
  const travel = useAppSelector(selectTravel);
  const backLinkTo =
    travel.status === ApplicationStatus.COMPLETE ? "/tb-certificate-summary" : "/tracker";

  return (
    <Container
      title="Proposed visa category - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantTravelVisaCategory />
    </Container>
  );
}
