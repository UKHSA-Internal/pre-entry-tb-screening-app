import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectTravel } from "@/redux/store";
import ApplicantTravelAddressAndContactDetails from "@/sections/applicant-travel-uk-address";
import { ApplicationStatus } from "@/utils/enums";

export default function TravelAddressAndContactDetailsPage() {
  const travel = useAppSelector(selectTravel);
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  const backLinkTo =
    fromParam === "/check-travel-information"
      ? "/check-travel-information"
      : travel.status === ApplicationStatus.COMPLETE
        ? "/tb-certificate-summary"
        : "/proposed-visa-category";

  return (
    <Container
      title="Visa applicant's proposed UK address - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantTravelAddressAndContactDetails />
    </Container>
  );
}
